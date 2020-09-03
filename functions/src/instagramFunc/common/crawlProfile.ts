import * as puppeteer from "puppeteer";

import { getPuppeteerOptions } from "../../common/utils";

export const crawlProfile = async (username: string) => {
  const browser = await puppeteer.launch(getPuppeteerOptions());
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" });

  //   await page.setRequestInterception(true);
  //   page.on("request", (request) => {
  //     const resourceType = request.resourceType();
  //     const resouceUrl = request.url();
  //     const abortCondition =
  //       ["image", "stylesheet", "font", "xhr", "manifest"].includes(resourceType) ||
  //       (resourceType === "script" && !/youtube.com/.test(resouceUrl)) ||
  //       (resourceType === "other" && !/ytimg.com/.test(resouceUrl));
  //     if (abortCondition) {
  //       request.abort();
  //     } else {
  //       request.continue();
  //     }
  //   });

  const targetUrl = `https://www.instagram.com/${username}/`;
  console.log(targetUrl);
  await page.goto(targetUrl, { timeout: 1000 * 120 });

  const ImageSelector = "header img" as const;
  await page.waitForSelector(ImageSelector);
  const imageEle = await page.$(ImageSelector);
  const imageUrl = (await (await imageEle.getProperty("src")).jsonValue()) as string;

  const NameSelector = "header h1" as const;
  await page.waitForSelector(NameSelector);
  const nameEle = await page.$(NameSelector);
  const name = (await (await nameEle.getProperty("textContent")).jsonValue()) as string;

  const DescriptionSelector = "header section > div > span" as const;
  await page.waitForSelector(DescriptionSelector);
  const descriptionEle = await page.$(DescriptionSelector);
  const description = (await (await descriptionEle.getProperty("textContent")).jsonValue()) as string;

  const StatSelector = "header ul a" as const;
  await page.waitForSelector(StatSelector);
  const statElements = await page.$$(StatSelector);
  const stats = [];
  for (const ele of statElements) {
    const stat = (await (await ele.getProperty("textContent")).jsonValue()) as string;
    const statNum = stat.match(/\d+(\.\d)?/);
    const statUnit = stat.match(/(?<=(\d+(\.\d)?))\D/g);
    const statLabel = stat.match(/^\D+(?=\d)/);
    if (statNum && statUnit) {
      let num = Number(statNum[0]);
      const unit = statUnit[statUnit.length - 1];
      if (unit === "万") {
        num *= 10000;
      }
      stats.push({
        label: statLabel[0],
        num,
      });
    }
  }

  await browser.close();

  return { name, description, imageUrl, stats };
};
