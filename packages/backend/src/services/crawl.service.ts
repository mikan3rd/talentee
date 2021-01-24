import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosRequestConfig } from "axios";
import cheerio = require("cheerio");
import { HttpsProxyAgent } from "https-proxy-agent";
import { LaunchOptions } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

type ProxyType = "none" | "normal" | "exclusive";

const UserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36";

@Injectable()
export class CrawlService {
  private readonly logger = new Logger(CrawlService.name);

  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  axiosSetup(proxyType: ProxyType = "none") {
    const config: AxiosRequestConfig = {
      headers: { "User-Agent": UserAgent },
      maxRedirects: 0,
    };

    if (proxyType === "normal") {
      config.proxy = false;
      config.httpsAgent = new HttpsProxyAgent({
        host: this.configService.get("PROXY_HOST_2"),
        port: this.configService.get("PROXY_PORT_2"),
        auth: `${this.configService.get("PROXY_USERNAME_2")}:${this.configService.get("PROXY_PASSWORD_2")}`,
      });
    }

    if (proxyType === "exclusive") {
      config.proxy = false;
      config.httpsAgent = new HttpsProxyAgent({
        host: this.configService.get("PROXY_HOST"),
        port: this.configService.get("PROXY_PORT"),
        auth: `${this.configService.get("PROXY_USERNAME")}:${this.configService.get("PROXY_PASSWORD")}`,
      });
    }

    return axios.create(config);
  }

  async puppeteerSetup(proxyType: ProxyType = "none") {
    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "-–disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--lang=ja",
    ];

    // -w "%{time_starttransfer}\n"
    if (proxyType === "normal") {
      const proxy = `${this.configService.get("PROXY_HOST_2")}:${this.configService.get("PROXY_PORT_2")}`;
      args.push(`--proxy-server=${proxy}`);
    }
    if (proxyType === "exclusive") {
      const proxy = `${this.configService.get("PROXY_HOST")}:${this.configService.get("PROXY_PORT")}`;
      args.push(`--proxy-server=${proxy}`);
    }

    const options: LaunchOptions = {
      // ignoreHTTPSErrors: true,
      headless: true,
      devtools: false,
      args,
    };

    const browser = await puppeteerExtra.use(StealthPlugin()).launch(options);
    const page = await browser.newPage();

    if (proxyType === "normal") {
      await page.authenticate({
        username: this.configService.get("PROXY_USERNAME_2") ?? "",
        password: this.configService.get("PROXY_PASSWORD_2") ?? "",
      });
    }
    if (proxyType === "exclusive") {
      await page.authenticate({
        username: this.configService.get("PROXY_USERNAME") ?? "",
        password: this.configService.get("PROXY_PASSWORD") ?? "",
      });
    }

    await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" });
    await page.setUserAgent(UserAgent);

    return { browser, page };
  }

  async getTrendVideoIds() {
    const baseUrl = `https://www.youtube.com`;
    const trendUrl = `${baseUrl}/feed/trending`;

    // TODO
    const axios = this.axiosSetup();
    const { data } = await axios.get<string>(trendUrl);

    // eslint-disable-next-line no-useless-escape
    const trendUrlReg = new RegExp(`/feed/trending\?[^"]*(?=")`, "g");
    const matchResults = data.match(trendUrlReg);
    if (!matchResults) {
      return null;
    }

    const trendUrls = Array.from(new Set(matchResults)).map((path) => `${baseUrl}${path}`);

    let videoIds: string[] = [];
    for (const url of trendUrls) {
      const { data } = await axios.get<string>(url);
      const videoMatchResults = data.match(/(?<=("\/watch\?v=))[^"]*(?=")/g);
      if (videoMatchResults) {
        videoIds = videoIds.concat(videoMatchResults);
      }
    }

    const uniqueVideoIds = Array.from(new Set(videoIds));
    this.logger.log(`uniqueVideoIds: ${uniqueVideoIds}`);
    return uniqueVideoIds;
  }

  async getChannelPopularVideo(channelId: string) {
    const { browser, page } = await this.puppeteerSetup();

    const targetChannelUrl = `https://www.youtube.com/channel/${channelId}/videos?sort=p`;
    await page.goto(targetChannelUrl);

    const LinkSelector = "a#thumbnail" as const;
    await page.waitForSelector(LinkSelector);
    const elements = await page.$$(LinkSelector);

    const videoIds: string[] = [];

    for (const ele of elements) {
      const property = await ele.getProperty("href");
      const value = (await property.jsonValue()) as string;
      const videoId = value.replace("https://www.youtube.com/watch?v=", "");
      if (videoId) {
        videoIds.push(videoId);
      }
    }

    await browser.close();

    const uniqueVideoIds = Array.from(new Set(videoIds));
    return uniqueVideoIds;
  }

  async getServiceLinkByYoutube(channelId: string) {
    const axios = this.axiosSetup();

    const targetUrl = `https://www.youtube.com/channel/${channelId}/about`;

    const { data } = await axios.get<string>(targetUrl);

    const matchResults = data.match(/{"responseContext":(.*})(?=(;))/);
    if (!matchResults) {
      return null;
    }

    const ytInitialData: ytInitialDataType = JSON.parse(matchResults[0]);

    const targetTab = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs.find(
      (tab) => tab.tabRenderer.selected,
    );
    if (!targetTab) {
      return [];
    }

    const targetSection = targetTab.tabRenderer.content.sectionListRenderer.contents[0];
    const targetItem = targetSection.itemSectionRenderer.contents[0];
    const linkUrls =
      targetItem.channelAboutFullMetadataRenderer.primaryLinks?.map((link) => {
        const redirectUrl = link.navigationEndpoint.urlEndpoint.url;
        const decodeUrl = decodeURIComponent(redirectUrl);
        const UrlObj = new URL(decodeUrl);
        const queryUrl = UrlObj.searchParams.get("q");
        if (queryUrl) {
          return queryUrl;
        }
        return `${UrlObj.origin}${UrlObj.pathname}`;
      }) ?? [];

    this.logger.log(`linkUrls: ${linkUrls}`);
    return linkUrls;
  }

  async crawlInstagramProfile(username: string) {
    const { browser, page } = await this.puppeteerSetup();

    const targetUrl = `https://www.instagram.com/${username}/`;
    await page.goto(targetUrl, { waitUntil: ["load", "networkidle2"] });

    let currentUrl = page.url();
    this.logger.log(`firstUrl: ${currentUrl}`);

    if (currentUrl.includes("login")) {
      const UsernameSelector = "input[name=username]";
      const PasswordSelector = "input[name=password]";

      await page.waitForSelector(UsernameSelector);
      await page.waitForSelector(PasswordSelector);

      const loginName = this.configService.get("INSTAGRAM_USERNAME");
      const loginPass = this.configService.get("INSTAGRAM_PASSWORD");

      if (!loginName || !loginPass) {
        throw Error("env variable is required!!");
      }

      await page.type(UsernameSelector, loginName);
      await page.type(PasswordSelector, loginPass);

      await Promise.all([page.keyboard.press("Enter"), page.waitForNavigation()]);

      currentUrl = page.url();
      this.logger.log(`secondUrl: ${currentUrl}`);
    }

    if (currentUrl.includes("onetap")) {
      const ButtonSelector = "main section button";
      await page.waitForSelector(ButtonSelector);
      await Promise.all([page.click(ButtonSelector), page.waitForNavigation()]);

      currentUrl = page.url();
      this.logger.log(`thirdUrl: ${currentUrl}`);
    }

    if (!currentUrl.includes(username)) {
      await page.goto(targetUrl, { waitUntil: ["load", "networkidle2"] });

      currentUrl = page.url();
      this.logger.log(`fourthUrl: ${currentUrl}`);
    }

    // const imageBuffer = await page.screenshot();
    // return imageBuffer;

    const sharedData: shareDataType = JSON.parse(await page.evaluate(() => JSON.stringify(window._sharedData)));

    await browser.close();

    const { ProfilePage } = sharedData.entry_data;

    if (!ProfilePage) {
      this.logger.log("Failed: crawlInstagramProfile");
      return null;
    }

    const {
      user: {
        id,
        username: _username,
        full_name,
        biography,
        external_url,
        edge_followed_by,
        edge_follow,
        is_private,
        is_verified,
        profile_pic_url,
        profile_pic_url_hd,
        edge_felix_video_timeline,
        edge_media_collections,
        edge_mutual_followed_by,
        edge_saved_media,
        edge_owner_to_timeline_media,
        edge_related_profiles,
      },
    } = ProfilePage[0].graphql;

    const userData = {
      id,
      username: _username,
      full_name,
      biography,
      external_url,
      followed_by: edge_followed_by.count,
      follow: edge_follow.count,
      is_private,
      is_verified,
      profile_pic_url,
      profile_pic_url_hd,
      felix_video_timeline: edge_felix_video_timeline.count,
      media_collections: edge_media_collections.count,
      mutual_followed_by: edge_mutual_followed_by.count,
      saved_media: edge_saved_media.count,
      related_profiles: edge_related_profiles?.edges.map((edge) => edge.node) ?? [],
    };

    const mediaData = edge_owner_to_timeline_media.edges.map((edge) => {
      const {
        id: mediaId,
        shortcode,
        owner,
        is_video,
        taken_at_timestamp,
        thumbnail_src,
        comments_disabled,
        display_url,
        edge_liked_by,
        edge_media_preview_like,
        edge_media_to_caption,
        edge_media_to_comment,
        edge_media_to_tagged_user,
        edge_sidecar_to_children,
        has_audio,
        video_view_count,
        product_type,
        location,
        dimensions,
        thumbnail_resources,
      } = edge.node;

      return {
        id: mediaId,
        shortcode,
        ownerId: owner.id,
        is_video,
        location,
        taken_at_timestamp,
        thumbnail_src,
        thumbnail_resources,
        comments_disabled,
        display_url,
        liked_by: edge_liked_by.count,
        media_preview_like: edge_media_preview_like.count,
        media_to_caption: edge_media_to_caption.edges.map((e) => e.node.text),
        media_to_comment: edge_media_to_comment.count,
        media_to_tagged_user: edge_media_to_tagged_user.edges.map((e) => e.node.user),
        sidecar_to_children: edge_sidecar_to_children?.edges.map((e) => e.node) ?? [],
        has_audio,
        video_view_count,
        product_type,
        dimensions,
      };
    });

    return { userData, mediaData };
  }

  async getTiktokUser(uniqueId: string) {
    type ContentDataType = {
      props: { pageProps: { userInfo: TiktokUserType; items: TiktokItemType[] } };
    };

    // const { browser, page } = await this.puppeteerSetup();
    const axios = this.axiosSetup();
    const url = `https://www.tiktok.com/@${uniqueId}`;
    const { data } = await axios.get<string>(url);

    const $ = cheerio.load(data);
    const DataSelector = "script#__NEXT_DATA__";
    const content = $(DataSelector).html();

    if (!content) {
      return null;
    }

    const contentData = JSON.parse(content) as ContentDataType;
    const { userInfo, items } = contentData.props.pageProps;
    return { userInfo, items };
  }
}

let window: customWindow;
interface customWindow extends Window {
  _sharedData: shareDataType;
}

type shareDataType = {
  entry_data: { ProfilePage?: { graphql: { user: InstagramUserBaseType } }[] };
};

type InstagramUserBaseType = {
  id: string;
  username: string;
  full_name: string;
  biography: string;
  external_url: string | null;
  edge_followed_by: { count: number };
  edge_follow: { count: number };
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  edge_felix_video_timeline: { count: number };
  edge_media_collections: { count: number };
  edge_mutual_followed_by: { count: number };
  edge_saved_media: { count: number };
  edge_related_profiles?: {
    edges: {
      node: {
        id: string;
        full_name: string;
        is_private: boolean;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
      };
    }[];
  };
  edge_owner_to_timeline_media: { count: number; edges: { node: InstagramMediaType }[] };
};

type InstagramMediaType = {
  id: string;
  shortcode: string;
  owner: { id: string; name: string };
  is_video: boolean;
  location: { id: string; name: string; slug: string; has_public_page: boolean };
  taken_at_timestamp: number;
  thumbnail_src: string;
  thumbnail_resources: { src: string; config_width: number; config_height: number }[];
  accessibility_caption: string;
  comments_disabled: boolean;
  dimensions: { height: number; width: number };
  display_url: string;
  edge_liked_by: { count: number };
  edge_media_preview_like: { count: number };
  edge_media_to_caption: { edges: { node: { text: string } }[] };
  edge_media_to_comment: { count: number };
  edge_media_to_tagged_user: { edges: { node: { user: InstagramUserBaseType } }[] };
  edge_sidecar_to_children?: { edges: { node: InstagramMediaType }[] };
  has_audio: boolean;
  video_view_count: number;
  product_type: "igtv" | "clips";
};

type TiktokUserType = {
  user: TiktokUserInfoType;
  stats: TiktokUserStatType;
};

type TiktokItemType = {
  id: string;
  author: TiktokUserInfoType;
  authorStats: TiktokUserStatType;
  desc: string;
  createTime: number;
  digged: boolean;
  duetEnabled: boolean;
  forFriend: boolean;
  itemMute: boolean;
  stitchEnabled: boolean;
  stats: {
    commentCount: number;
    diggCount: number;
    playCount: number;
    shareCount: number;
  };
  music: {
    id: string;
    title: string;
    authorName: string;
    coverLarge: string;
    coverMedium: string;
    coverThumb: string;
    original: boolean;
    playUrl: string;
  };
  video: {
    id: string;
    cover: string;
    downloadAddr: string;
    playAddr: string;
    duration: number;
    originCover: string;
    dynamicCover: string;
    reflowCover: string;
    width: number;
    height: number;
    ratio: string;
  };
};

type TiktokUserInfoType = {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarThumb: string;
  avatarMedium: string;
  signature: string;
  verified: boolean;
  secret: boolean;
  privateAccount: boolean;
  secUid: string;
  openFavorite: boolean;
  relation: number;
  bioLink?: { link: string };
  createTime: number;
};

type TiktokUserStatType = {
  followingCount: number;
  followerCount: number;
  heartCount: number;
  videoCount: number;
  diggCount: number;
};

type ytInitialDataType = {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer: {
          title: string;
          selected: boolean;
          content: {
            sectionListRenderer: {
              contents: {
                itemSectionRenderer: {
                  contents: {
                    channelAboutFullMetadataRenderer: {
                      primaryLinks?: { title: string; navigationEndpoint: { urlEndpoint: { url: string } } }[];
                    };
                  }[];
                };
              }[];
            };
          };
        };
      }[];
    };
  };
};
