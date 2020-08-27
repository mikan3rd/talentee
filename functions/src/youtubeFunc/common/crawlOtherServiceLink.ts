import * as puppeteer from "puppeteer";

import { getPuppeteerOptions } from "../../common/utils";

export const crawlOtherServiceLink = async (channelId: string) => {
  const browser = await puppeteer.launch(getPuppeteerOptions());
  const page = await browser.newPage();

  const trendUrl = `https://www.youtube.com/channel/${channelId}/about`;
  await page.goto(trendUrl);

  const LinkSelector = "#link-list-container a" as const;
  await page.waitForSelector(LinkSelector);
  const elements = await page.$$(LinkSelector);

  const linkUrls: string[] = [];
  for (const ele of elements) {
    const property = await ele.getProperty("href");
    const value = (await property.jsonValue()) as string;
    const result = value.match(/(?<=q\=)\S+/);
    if (result) {
      const url = decodeURIComponent(result[0]);
      console.log(url);
      linkUrls.push(url);
    }
  }

  await browser.close();

  return linkUrls;
};
