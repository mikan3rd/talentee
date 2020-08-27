import * as puppeteer from "puppeteer";

import { getPuppeteerOptions } from "../common/utils";

export const getTrendVideoIds = async () => {
  const browser = await puppeteer.launch(getPuppeteerOptions(true));
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  );

  const trendUrl = `https://www.youtube.com/feed/trending`;
  await page.goto(trendUrl, { timeout: 1000 * 120 });

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
