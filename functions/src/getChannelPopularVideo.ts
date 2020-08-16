import * as puppeteer from "puppeteer";

export const getChannelPopularVideo = async (channelId: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

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
  return uniqueVideoIds;
};
