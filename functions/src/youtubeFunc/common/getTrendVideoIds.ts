import * as puppeteer from "puppeteer";

import { UserAgent, getPuppeteerOptions } from "../../common/utils";

export const getTrendVideoIds = async () => {
  const browser = await puppeteer.launch(getPuppeteerOptions(true));
  const page = await browser.newPage();

  await page.setUserAgent(UserAgent);

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    // const resouceUrl = request.url();
    const abortCondition = ["image", "stylesheet", "font", "manifest"].includes(resourceType);
    if (abortCondition) {
      request.abort();
    } else {
      // console.log(resourceType, resouceUrl);
      request.continue();
    }
  });

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
    console.log(url);
    await page.goto(url, { timeout: 1000 * 120 });
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
  console.log(JSON.stringify({ uniqueVideoIds }));
  return uniqueVideoIds;
};
