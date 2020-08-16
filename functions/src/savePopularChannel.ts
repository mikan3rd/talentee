import * as dayjs from "dayjs";
import * as functions from "firebase-functions";
import { google, youtube_v3 } from "googleapis";

import { getVideoCategories } from "./common/getVideoCategories";
import { saveChannel } from "./common/saveChannel";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

export const savePopularChannel = async (publishedAfter: dayjs.Dayjs) => {
  const videoCategories = await getVideoCategories();
  for (const videoCategory of videoCategories) {
    const {
      snippet: { assignable },
    } = videoCategory;
    if (!assignable) {
      continue;
    }
    await savePopularChannelByCategory(publishedAfter, videoCategory);
  }
};

const savePopularChannelByCategory = async (
  publishedAfter: dayjs.Dayjs,
  videoCategory: youtube_v3.Schema$VideoCategory,
) => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  const searchResponse = await service.search.list({
    part: ["id", "snippet"],
    type: ["video"],
    videoCategoryId: videoCategory.id,
    regionCode: "JP",
    relevanceLanguage: "ja",
    order: "viewCount",
    maxResults: 50,
    publishedAfter: publishedAfter.toISOString(),
    location: "35.68,139.76", // 東京駅
    locationRadius: "500km", // 大阪あたりまで,
  });

  const channnelIds = searchResponse.data.items.map((item) => item.snippet.channelId);

  await saveChannel(channnelIds);
};
