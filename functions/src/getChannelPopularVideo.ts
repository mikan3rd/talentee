import * as puppeteer from "puppeteer";

import { getPuppeteerOptions } from "./common/utils";

export const getChannelPopularVideo = async (channelId: string) => {
  const browser = await puppeteer.launch(getPuppeteerOptions());
  const page = await browser.newPage();

  // await page.setExtraHTTPHeaders({
  //   "Accept-Language": "ja-JP",
  // });

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
  // console.log("channelPopularVideoIds:", uniqueVideoIds);
  return uniqueVideoIds;
};
