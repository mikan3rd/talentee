import * as puppeteer from "puppeteer";

import { UserAgent, getPuppeteerOptions } from "../../common/utils";

export const crawlSearchTweet = async (username: string) => {
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

  let minRetweets = 1000;
  let targetUrl = encodeURI(`https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`);
  console.log(targetUrl);
  await page.goto(targetUrl, { timeout: 1000 * 120 });

  const LinkSelector = "article a" as const;
  try {
    await page.waitForSelector(LinkSelector);
  } catch {
    try {
      minRetweets = 100;
      targetUrl = encodeURI(`https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`);
      console.log(targetUrl);
      await page.goto(targetUrl, { timeout: 1000 * 120 });
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
    const formatUrl = url.replace(/\/photo\/\d+$/, "");
    if (statusUrlReg.test(formatUrl)) {
      linkUrls.push(formatUrl);
    }
  }

  await browser.close();

  const uniqueUrls = Array.from(new Set(linkUrls));
  console.log(JSON.stringify({ uniqueUrls }));
  return uniqueUrls;
};
