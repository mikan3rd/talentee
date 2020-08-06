import * as functions from "firebase-functions";
import { google } from "googleapis";
import * as dayjs from "dayjs";

import "dayjs/locale/ja";
dayjs.locale("ja");

const YOUTUBE_API_KEY = "";

export const getYoytubePopularChannel = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  const publishedAfter = dayjs().subtract(1, "week").toISOString();
  const searchResponse = await service.search.list({
    part: ["id", "snippet"],
    type: ["video"],
    regionCode: "JP",
    relevanceLanguage: "ja",
    order: "viewCount",
    maxResults: 10,
    publishedAfter,
    location: "35.68,139.76", // 東京駅
    locationRadius: "500km", // 大阪あたりまで,
    eventType: "completed",
  });

  const videoIds = searchResponse.data.items.map((item) => item.id.videoId);
  const videoResponse = await service.videos.list({
    part: ["id", "snippet", "contentDetails", "statistics", "player"],
    hl: "ja",
    id: videoIds,
  });

  const channnelIds = videoResponse.data.items.map((item) => item.snippet.channelId);
  const uniqueChannelIds = Array.from(new Set(channnelIds));

  const channelResponse = await service.channels.list({
    part: [
      "id",
      "snippet",
      "contentDetails",
      "statistics",
      "topicDetails",
      "brandingSettings",
      "status",
      "localizations",
    ],
    id: uniqueChannelIds,
  });

  const result = channelResponse.data.items.map((item) => {
    const {
      id,
      snippet: { title, description, publishedAt, country },
      statistics: { viewCount, subscriberCount },
    } = item;
    const videos = videoResponse.data.items
      .filter((videoItem) => videoItem.snippet.channelId === id)
      .map((videoItem) => {
        const {
          id,
          snippet: { title, description, publishedAt, tags, defaultLanguage, defaultAudioLanguage, categoryId },
          statistics: { viewCount, likeCount, dislikeCount, commentCount },
        } = videoItem;
        const videoData = {
          id,
          snippet: { title, description, publishedAt, tags, defaultLanguage, defaultAudioLanguage, categoryId },
          statistics: { viewCount, likeCount, dislikeCount, commentCount },
        };
        return videoData;
      });
    const data = {
      channnel: {
        id,
        snippet: { title, description, publishedAt, country },
        statistics: { viewCount, subscriberCount },
      },
      videos,
    };
    return data;
  });

  res.send({ result });
});
