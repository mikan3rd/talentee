import * as admin from "firebase-admin";
import { google } from "googleapis";
import * as dayjs from "dayjs";

const YOUTUBE_API_KEY = "";

const YoutubeChannelCollectionPath = "youtubeChannel" as const;

const { FieldValue } = admin.firestore;

export const savePopularChannel = async () => {
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
  });

  const channnelIds = searchResponse.data.items.map((item) => item.snippet.channelId);
  const uniqueChannelIds = Array.from(new Set(channnelIds));

  const channelResponse = await service.channels.list({
    part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
    id: uniqueChannelIds,
  });

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const result = [];
  for (const item of channelResponse.data.items) {
    const {
      id,
      snippet,
      statistics,
      brandingSettings: {
        channel: { keywords, ...channnelObjects },
        ...brandSettingObjects
      },
    } = item;

    const formattedStatistics = {};
    Object.entries(statistics).forEach(([key, value]) => {
      if (isNaN(Number(value))) {
        formattedStatistics[key] = value;
      } else {
        formattedStatistics[key] = Number(value);
      }
    });
    const keywordArray = keywords ? keywords.split(/\s/) : [];

    const data = {
      id,
      snippet,
      statistics: formattedStatistics,
      brandingSettings: { ...brandSettingObjects, channel: { ...channnelObjects, keywords: keywordArray } },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const ref = youtubeChannelCollection.doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      delete data.createdAt;
    }
    await ref.set(data, { merge: true });

    result.push(data);
  }

  return result;
};
