import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

import { CrawlService } from "@/services/crawl.service";
import { InstagramService } from "@/services/instagram.service";
import { PrismaService } from "@/services/prisma.service";
import { TiktokService } from "@/services/tiktok.service";
import { TwitterService } from "@/services/twitter.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private prisma: PrismaService,
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
    private instagramService: InstagramService,
    private tiktokService: TiktokService,
  ) {}

  async getAccountPage(uuid: string) {
    const take = 3;
    return this.prisma.account.findUnique({
      where: { uuid },
      include: {
        youtubeChannels: {
          include: {
            videos: {
              take,
              orderBy: { viewCount: "desc" },
              include: { tags: { include: { tag: true }, orderBy: { tag: { num: "desc" } } } },
            },
            keywords: { include: { keyword: true }, orderBy: { keyword: { num: "desc" } } },
            channelVideoCategories: { orderBy: { num: "desc" }, include: { videoCategory: true } },
          },
        },
        twitterUsers: { include: { tweets: { take, orderBy: { retweetCount: "desc" } } } },
        instagramUsers: { include: { mediaList: { take, orderBy: { likedBy: "desc" } } } },
        tiktokUsers: { include: { items: { take, orderBy: { diggCount: "desc" } } } },
      },
    });
  }

  async getTopPage() {
    const take = 3;
    const accountArgs: Prisma.AccountArgs = {
      include: {
        youtubeChannels: { select: { id: true } },
        twitterUsers: { select: { username: true } },
        instagramUsers: { select: { username: true } },
        tiktokUsers: { select: { uniqueId: true } },
      },
    };
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      orderBy: { subscriberCount: "desc" },
      include: {
        keywords: { include: { keyword: true }, orderBy: { keyword: { num: "desc" } } },
        channelVideoCategories: { orderBy: { num: "desc" }, include: { videoCategory: true } },
        account: accountArgs,
      },
    });
    const twitterUsers = await this.prisma.twitterUser.findMany({
      take,
      orderBy: { followersCount: "desc" },
      include: { account: accountArgs },
    });
    const instagramUsers = await this.prisma.instagramUser.findMany({
      take,
      orderBy: { followedBy: "desc" },
      include: { account: accountArgs },
    });
    const tiktokUsers = await this.prisma.tiktokUser.findMany({
      take,
      orderBy: { followerCount: "desc" },
      include: { account: accountArgs },
    });
    return { youtubeChannels, twitterUsers, instagramUsers, tiktokUsers };
  }

  async searchByName({ word, take, page }: { word: string; take: number; page: number }) {
    const where: Prisma.AccountWhereInput = {
      OR: [
        { youtubeChannels: { some: { title: { contains: word } } } },
        { twitterUsers: { some: { name: { contains: word } } } },
        { instagramUsers: { some: { fullName: { contains: word } } } },
        { tiktokUsers: { some: { nickname: { contains: word } } } },
      ],
    };
    const totalCount = await this.prisma.account.count({ where });
    const accounts = this.prisma.account.findMany({
      take,
      skip: take * (page - 1),
      where,
      include: {
        youtubeChannels: { select: { id: true } },
        twitterUsers: { select: { username: true } },
        instagramUsers: { select: { username: true } },
        tiktokUsers: { select: { uniqueId: true } },
      },
    });
    return { totalCount, totalPages: Math.ceil(totalCount / take), accounts };
  }

  async getSitemapData() {
    const accounts = await this.prisma.account.findMany({ select: { uuid: true } });
    const youtubeVideoCategories = await this.prisma.youtubeVideoCategory.findMany({
      where: { assignable: true },
      select: { id: true },
    });
    const youtubeKeywords = await this.prisma.youtubeKeyword.findMany({
      select: { title: true },
      where: { num: { gte: 3 } },
      orderBy: { num: "desc" },
    });
    return { accounts, youtubeVideoCategories, youtubeKeywords };
  }

  async addServiceByYoutube(take: number) {
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      include: { account: { select: { uuid: true } } },
      orderBy: { updatedAt: "desc" },
      where: {
        account: {
          isNot: {
            AND: {
              twitterUsers: { some: {} },
              instagramUsers: { some: {} },
              tiktokUsers: { some: {} },
            },
          },
        },
      },
    });

    let serviceUsernames: ServiceNameDataList = [];
    for (const [index, channel] of youtubeChannels.entries()) {
      this.logger.log(`${index} ${channel.id}`);
      const linkUrls = await this.crawlService.getServiceLinkByYoutube(channel.id);

      if (!linkUrls) {
        return;
      }

      const services = linkUrls
        .map((url) => this.judgeServiceAccount(url))
        .filter((service) => service.serviceName !== "youtube");

      const currentServiceUsernames = this.groupByServiceName(services).map(({ serviceName, items }) => ({
        serviceName,
        username: items[0].username,
        accountId: channel.account.uuid,
      }));
      serviceUsernames = serviceUsernames.concat(currentServiceUsernames);
    }

    const baseDataList = this.groupByBulkServiceName(serviceUsernames);
    await this.addServiceByLinkUrls(baseDataList);
  }

  async addServiceByTwitter(take: number) {
    const twitterUsers = await this.prisma.twitterUser.findMany({
      take,
      include: { account: { select: { uuid: true } } },
      orderBy: { updatedAt: "desc" },
      where: {
        account: {
          isNot: {
            AND: {
              youtubeChannels: { some: {} },
              instagramUsers: { some: {} },
              tiktokUsers: { some: {} },
            },
          },
        },
      },
    });

    const baseDataMapping = twitterUsers.reduce((prev, { username, accountId }) => {
      prev[username] = { accountId, username };
      return prev;
    }, {} as { [username: string]: { username: string; accountId: string } });
    const usernames = twitterUsers.map((user) => user.username);
    const response = await this.twitterService.getUsersByUsername(usernames);

    let serviceUsernames: ServiceNameDataList = [];
    for (const [, user] of (response?.data ?? []).entries()) {
      const linkUrls = user.entities?.url?.urls.map((url) => url.expanded_url) ?? [];
      const uniqueUrls = Array.from(new Set(linkUrls));

      const services = uniqueUrls
        .map((url) => this.judgeServiceAccount(url))
        .filter((service) => service.serviceName !== "twitter");

      const currentServiceUsernames = this.groupByServiceName(services).map(({ serviceName, items }) => ({
        serviceName,
        username: items[0].username,
        accountId: baseDataMapping[user.username].accountId,
      }));
      serviceUsernames = serviceUsernames.concat(currentServiceUsernames);
    }

    const baseDataList = this.groupByBulkServiceName(serviceUsernames);
    await this.addServiceByLinkUrls(baseDataList);
  }

  async addServiceByLinkUrls(
    baseDataList: { serviceName: ServiceNameType; data: { accountId: string; username: string }[] }[],
  ) {
    for (const { serviceName, data } of baseDataList) {
      const filteredData = await this.utilsService.asyncFilter(data, async ({ accountId, username }) => {
        if (!username) return false;

        const account = await this.prisma.account.findUnique({
          where: { uuid: accountId },
          include: { youtubeChannels: true, twitterUsers: true, instagramUsers: true, tiktokUsers: true },
        });

        if (!account) return false;
        if (serviceName === "youtube" && account.youtubeChannels.length) return false;
        if (serviceName === "twitter" && account.twitterUsers.length) return false;
        if (serviceName === "instagram" && account.instagramUsers.length) return false;
        if (serviceName === "tiktok" && account.tiktokUsers.length) return false;

        if (serviceName === "youtube") {
          const youtubeChannel = await this.prisma.youtubeChannel.findUnique({ where: { id: username } });
          if (youtubeChannel) return false;
        }
        if (serviceName === "twitter") {
          const twitterUser = await this.prisma.twitterUser.findUnique({ where: { username } });
          if (twitterUser) return false;
        }
        if (serviceName === "instagram") {
          const instagramUser = await this.prisma.instagramUser.findUnique({ where: { username } });
          if (instagramUser) return false;
        }
        if (serviceName === "tiktok") {
          const tiktokUser = await this.prisma.tiktokUser.findUnique({ where: { uniqueId: username } });
          if (tiktokUser) return false;
        }

        return true;
      });

      this.logger.log(`serviceName: ${serviceName}, data: ${data.length}, filteredData: ${filteredData.length}`);

      if (serviceName === "youtube") {
        const baseData = filteredData.map(({ accountId, username }) => ({ accountId, channelId: username }));
        await this.youtubeService.bulkUpsertChannelByChannelId(baseData, false);
      }
      if (serviceName === "twitter") {
        const baseData = filteredData.map(({ accountId, username }) => ({ accountId, username }));
        await this.twitterService.upsertUsersByUsername(baseData);
      }
      if (serviceName === "instagram") {
        const baseData = filteredData.map(({ accountId, username }) => ({ accountId, username }));
        await this.instagramService.upsertUsers(baseData);
      }
      if (serviceName === "tiktok") {
        const baseData = filteredData.map(({ accountId, username }) => ({ accountId, uniqueId: username }));
        await this.tiktokService.bulkUpdateByUniqueId(baseData, false);
      }
    }
  }

  async bulkUpdate(take: number) {
    const beforeDate = dayjs().subtract(1, "day");
    const accounts = await this.prisma.account.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: {
        youtubeChannels: { select: { id: true } },
        twitterUsers: { select: { username: true } },
        instagramUsers: { select: { username: true } },
        tiktokUsers: { select: { uniqueId: true } },
      },
      where: { updatedAt: { lte: beforeDate.toDate() } },
    });

    const youtubeBaseDataList = [];
    const twitterBaseDataList = [];
    const instagramBaseDataList = [];
    const tiktokBaseDataList = [];

    for (const account of accounts) {
      const { uuid, youtubeChannels, twitterUsers, instagramUsers, tiktokUsers } = account;
      for (const youtubeChannel of youtubeChannels) {
        youtubeBaseDataList.push({ channelId: youtubeChannel.id, accountId: uuid });
      }
      for (const twitterUser of twitterUsers) {
        twitterBaseDataList.push({ username: twitterUser.username, accountId: uuid });
      }
      for (const instagramUser of instagramUsers) {
        instagramBaseDataList.push({ username: instagramUser.username, accountId: uuid });
      }
      for (const tiktokUser of tiktokUsers) {
        tiktokBaseDataList.push({ uniqueId: tiktokUser.uniqueId, accountId: uuid });
      }
    }

    this.logger.log(
      `account: ${accounts.length}, youtube: ${youtubeBaseDataList.length}, twitter: ${twitterBaseDataList.length}, instagram: ${instagramBaseDataList.length}, tiktok: ${tiktokBaseDataList.length}`,
    );

    await this.youtubeService.bulkUpsertChannelByChannelId(youtubeBaseDataList, false);
    await this.twitterService.upsertUsersByUsername(twitterBaseDataList);
    await this.instagramService.upsertUsers(instagramBaseDataList);
    await this.tiktokService.bulkUpdateByUniqueId(tiktokBaseDataList, false);
  }

  async addYoutubeChannelByYoutura(pageNum: number) {
    const channeUrls = await this.crawlService.crawlYouturaRanking(pageNum);
    this.logger.log(`channeUrls: ${channeUrls.length}`);
    const channelIds = channeUrls.map((url) => this.judgeServiceAccount(url)).map((service) => service.username);
    const baseDataList = channelIds.map((channelId) => ({ channelId }));
    await this.youtubeService.bulkUpsertChannelByChannelId(baseDataList, false);
  }

  async tweetRandomYoutubeAccount() {
    const where: Prisma.AccountWhereInput = { youtubeChannels: { some: {} } };

    const count = await this.prisma.account.count({ where });
    const skip = this.utilsService.getRandomNum(count);
    console.log(`${skip} / ${count}`);

    const account = await this.prisma.account.findFirst({ skip, where, include: { youtubeChannels: true } });
    const youtubeChannel = account?.youtubeChannels[0];

    if (!account || !youtubeChannel) {
      return;
    }

    const accountUrl = `https://talentee.jp/account/${account.uuid}`;

    // OGPを表示させるためにTwitterのcacheを更新
    await this.crawlService.updateTwitterCardCache([accountUrl]);

    let statuses = [`【人気YouTuberまとめ】`, ``, youtubeChannel.title, ``];

    if (youtubeChannel.subscriberCount) {
      statuses.push(`【チャンネル登録者数】${this.utilsService.toUnitString(youtubeChannel.subscriberCount)}人`);
    }

    statuses = statuses.concat([
      `【再生回数】${this.utilsService.toUnitString(youtubeChannel.viewCount)}回`,
      `【動画投稿数】${this.utilsService.toUnitString(youtubeChannel.videoCount)}本`,
      ``,
      accountUrl,
    ]);
    const status = statuses.join("\n");

    const client = this.twitterService.getOldClientBot();
    await client.post("statuses/update", { status });
  }

  async updateTwitterCardCache() {
    const accounts = await this.prisma.account.findMany();
    const accountUrls = accounts.map((account) => `https://talentee.jp/account/${account.uuid}`);
    await this.crawlService.updateTwitterCardCache(accountUrls);
  }

  private groupByBulkServiceName(serviceUsernames: ServiceNameDataList) {
    const groupByServiceData = serviceUsernames.reduce((prev, { serviceName, username, accountId }) => {
      if (!prev[serviceName]) {
        prev[serviceName] = { serviceName, data: {} };
      }
      if (!prev[serviceName].data[username]) {
        prev[serviceName].data[username] = { username, accountId };
      }
      return prev;
    }, {} as { [key in ServiceNameType]: GroupByValue });

    return Object.values(groupByServiceData).map(({ serviceName, data }) => {
      return {
        serviceName,
        data: Object.values(data),
      };
    });
  }

  private groupByServiceName(services: ServiceType[]) {
    return this.utilsService
      .groupByObject(services, (service) => service.serviceName)
      .map(([serviceName, items]) => {
        return { serviceName, items: items.map((item, index) => ({ ...item, num: index + 1 })) };
      });
  }

  private judgeServiceAccount(url: string) {
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch (e) {
      this.logger.error(e);
      return {
        serviceName: "other" as ServiceNameType,
        username: "",
        url,
      };
    }
    const pathArray = pathname.split("/").reverse();
    let username = pathArray.find((path) => !!path) || "";

    let serviceName: ServiceNameType = "other";
    if (/twitter.com/.test(url)) {
      serviceName = "twitter" as const;
      username = username.replace("@", "");
    } else if (/instagram.com/.test(url)) {
      serviceName = "instagram" as const;
    } else if (/ch.nicovideo.jp/.test(url)) {
      serviceName = "nicovideo_channel" as const;
    } else if (/nicovideo.jp/.test(url)) {
      serviceName = "nicovideo_user" as const;
    } else if (/v?t.tiktok.com/.test(url)) {
      serviceName = "tiktok_vt" as const;
      username = username.replace("@", "");
    } else if (/tiktok.com/.test(url)) {
      serviceName = "tiktok" as const;
      username = username.replace("@", "");
    } else if (/youtube.com/.test(url)) {
      serviceName = "youtube" as const;
    }

    return {
      serviceName,
      username,
      url,
    };
  }
}

type ServiceNameType =
  | "twitter"
  | "instagram"
  | "nicovideo_channel"
  | "nicovideo_user"
  | "tiktok"
  | "tiktok_vt"
  | "youtube"
  | "other";

type ServiceType = {
  serviceName: ServiceNameType;
  username: string;
  url: string;
};

type ServiceNameDataList = { serviceName: ServiceNameType; username: string; accountId: string }[];

type GroupByValue = {
  serviceName: ServiceNameType;
  data: { [username: string]: { username: string; accountId: string } };
};
