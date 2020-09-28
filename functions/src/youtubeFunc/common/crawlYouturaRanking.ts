import * as cheerio from "cheerio";

import { axiosSetup } from "../../common/utils";

const baseUrl = `https://ytranking.net`;
const linkSelector = "p.more a" as const;

export const crawlYouturaTotalRanking = async () => {
  return await crawlYouturaRanking("/ranking", 20);
};

export const crawlYouturaMonthlyRanking = async () => {
  return await crawlYouturaRanking("/ranking/mon", 10);
};

export const crawlYouturaDailyRanking = async () => {
  return await crawlYouturaRanking("/ranking/day", 10);
};

const crawlYouturaRanking = async (pagePath: string, pageNum: number) => {
  const axios = axiosSetup();

  const detailLinks: string[] = [];
  for (const i of [...Array(pageNum).keys()]) {
    const subscribeUrl = `${baseUrl}${pagePath}/?p=${i + 1}`;
    const playCountUrl = `${baseUrl}${pagePath}/?p=${i + 1}&mode=view`;
    console.log(playCountUrl);
    const subscribeResponse = await axios.get<string>(subscribeUrl);
    const playcountResponse = await axios.get<string>(playCountUrl);

    {
      const $ = cheerio.load(subscribeResponse.data);
      $(linkSelector).each((index, ele) => {
        const link = $(ele).attr("href");
        detailLinks.push(link);
      });
    }

    {
      const $ = cheerio.load(playcountResponse.data);
      $(linkSelector).each((index, ele) => {
        const link = $(ele).attr("href");
        detailLinks.push(link);
      });
    }
  }

  return await getChannelUrls(detailLinks);
};

const getChannelUrls = async (detailLinks: string[]) => {
  const axios = axiosSetup();
  const uniqueDetailLinks = Array.from(new Set(detailLinks));
  console.log(uniqueDetailLinks.length, detailLinks.length);
  const channeUrls: string[] = [];
  for (const link of uniqueDetailLinks) {
    const detailUrl = `${baseUrl}${link}`;
    const { data } = await axios.get<string>(detailUrl);
    const $ = cheerio.load(data);
    const channelUrl = $("article header h1 a").attr("href");
    channeUrls.push(channelUrl);
  }
  return channeUrls;
};
