import { puppeteerSetup } from "../../common/utils";

export const getChannelPopularVideo = async (channelId: string) => {
  const { browser, page } = await puppeteerSetup();

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
  console.log(JSON.stringify({ uniqueVideoIds }));
  return uniqueVideoIds;
};
