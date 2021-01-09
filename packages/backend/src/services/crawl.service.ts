import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { LaunchOptions } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

type ProxyType = "none" | "normal" | "exclusive";

const UserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36";

@Injectable()
export class CrawlService {
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
      console.log({ url });
      const { data } = await axios.get<string>(url);
      const videoMatchResults = data.match(/(?<=("\/watch\?v=))[^"]*(?=")/g);
      if (videoMatchResults) {
        videoIds = videoIds.concat(videoMatchResults);
      }
    }

    const uniqueVideoIds = Array.from(new Set(videoIds));
    console.log({ uniqueVideoIds });
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
    console.log({ uniqueVideoIds });
    return uniqueVideoIds;
  }
}
