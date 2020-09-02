import * as puppeteer from "puppeteer";

import { getPuppeteerOptions } from "../../common/utils";

export const crawlSearchTweet = async (username: string) => {
  const browser = await puppeteer.launch(getPuppeteerOptions());
  const page = await browser.newPage();

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

  let minRetweets = 1000;
  let targetUrl = `https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`;
  console.log(targetUrl);
  await page.goto(encodeURI(targetUrl));

  const LinkSelector = "article a" as const;
  try {
    await page.waitForSelector(LinkSelector);
  } catch {
    try {
      minRetweets = 100;
      targetUrl = `https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`;
      console.log(targetUrl);
      await page.goto(encodeURI(targetUrl));
      await page.waitForSelector(LinkSelector);
    } catch (e) {
      console.error(e);
      await browser.close();
      return [];
    }
  }
  const elements = await page.$$(LinkSelector);

  const statusUrlReg = new RegExp(`${username}/status/`);

  const linkUrls: string[] = [];
  for (const ele of elements) {
    const property = await ele.getProperty("href");
    const url = (await property.jsonValue()) as string;
    if (statusUrlReg.test(url)) {
      linkUrls.push(url);
    }
  }

  await browser.close();

  return linkUrls;
};
