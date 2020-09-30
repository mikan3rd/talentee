import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";

import {
  crawlYouturaDailyRanking,
  crawlYouturaMonthlyRanking,
  crawlYouturaTotalRanking,
} from "./common/crawlYouturaRanking";
import { saveChannel } from "./common/saveChannel";

export const addChannelByYouturaTotal = async () => {
  const channelUrls = await crawlYouturaTotalRanking();
  await addChannel(channelUrls);
};

export const addChannelByYouturaMonthly = async () => {
  const channelUrls = await crawlYouturaMonthlyRanking();
  await addChannel(channelUrls);
};

export const addChannelByYouturaDaily = async () => {
  const channelUrls = await crawlYouturaDailyRanking();
  await addChannel(channelUrls);
};

const addChannel = async (channelUrls: string[]) => {
  const { items } = bulkJudgeServiceAccount(channelUrls)[0];
  const channnelIds = items.map((item) => item.username);
  await saveChannel(channnelIds, false);
};
