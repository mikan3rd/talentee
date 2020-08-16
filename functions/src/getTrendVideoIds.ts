import * as puppeteer from "puppeteer";

export const getTrendVideoIds = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

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

  return uniqueVideoIds;
};
