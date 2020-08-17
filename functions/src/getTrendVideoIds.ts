import * as functions from "firebase-functions";
import puppeteer from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

import { puppeteerOptions } from "./common/utils";

const GMAIL_ENV = functions.config().gmail;

export const getTrendVideoIds = async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch(puppeteerOptions);
  const page = await browser.newPage();

  // await page.setUserAgent(
  //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  // );

  // await page.setExtraHTTPHeaders({
  //   "Accept-Language": "ja-JP",
  // });

  const topUrl = `https://www.youtube.com`;
  await page.goto(topUrl);
  const LoginSelector = "#masthead-container #buttons ytd-button-renderer a" as const;
  await page.waitForSelector(LoginSelector, { timeout: 1000 * 60 });
  await page.click(LoginSelector);

  const MailSelector = "input[type=email]" as const;
  await page.waitForSelector(MailSelector);
  await page.type(MailSelector, GMAIL_ENV.email);
  await page.keyboard.press("Enter");

  const PasswordSelector = "input[type=password]" as const;
  await page.waitFor(1000 * 5);
  await page.waitForSelector(PasswordSelector);
  await page.type(PasswordSelector, GMAIL_ENV.pass);
  await page.keyboard.press("Enter");

  await page.waitForSelector("div#start");

  const trendUrl = `https://www.youtube.com/feed/trending`;
  await page.goto(trendUrl);

  const SubMenuSelector = "#sub-menu #contents a" as const;
  await page.waitForSelector(SubMenuSelector);
  const subMenuElements = await page.$$(SubMenuSelector);

  const trendUrls = [trendUrl];

  for (const ele of subMenuElements) {
    const property = await ele.getProperty("href");
    const value = (await property.jsonValue()) as string;
    if (value) {
      trendUrls.push(value);
    }
  }

  const LinkSelector = "a#thumbnail" as const;
  const videoIds: string[] = [];

  for (const url of trendUrls) {
    await page.goto(url);
    await page.waitForSelector(LinkSelector);
    const linkElements = await page.$$(LinkSelector);

    for (const ele of linkElements) {
      const property = await ele.getProperty("href");
      const value = (await property.jsonValue()) as string;
      const videoId = value.replace("https://www.youtube.com/watch?v=", "");
      if (videoId) {
        videoIds.push(videoId);
      }
    }
  }

  await browser.close();

  const uniqueVideoIds = Array.from(new Set(videoIds));
  console.log("trendVideoIds:", uniqueVideoIds);
  return uniqueVideoIds;
};
