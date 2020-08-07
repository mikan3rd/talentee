import * as admin from "firebase-admin";
import { google, youtube_v3 } from "googleapis";
import * as dayjs from "dayjs";
import * as functions from "firebase-functions";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

const YoutubeChannelCollectionPath = "youtubeChannel" as const;

const { FieldValue } = admin.firestore;

export const savePopularChannel = async (publishedAfter: dayjs.Dayjs) => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  const searchResponse = await service.search.list({
    part: ["id", "snippet"],
    type: ["video"],
    regionCode: "JP",
    relevanceLanguage: "ja",
    order: "viewCount",
    maxResults: 50,
    publishedAfter: publishedAfter.toISOString(),
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
    const data = formatChannelData(item);
    const { id } = item;
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

const formatChannelData = (item: youtube_v3.Schema$Channel) => {
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
    if (typeof value !== "string" || isNaN(Number(value))) {
      formattedStatistics[key] = value;
    } else {
      formattedStatistics[key] = Number(value);
    }
  });

  const keywordArray: string[] = [];
  if (keywords) {
    let tmpKeyword = "";
    for (const keyword of keywords.split(/\s/)) {
      const separator = '"';
      const firstString = keyword.charAt(0);
      const lastString = keyword.slice(-1);
      if (firstString === separator) {
        tmpKeyword = keyword.substr(1);
        continue;
      }
      if (lastString === separator) {
        keywordArray.push(`${tmpKeyword} ${keyword.slice(0, -1)}`);
        tmpKeyword = "";
        continue;
      }
      if (tmpKeyword) {
        tmpKeyword += " " + keyword;
        continue;
      }
      keywordArray.push(keyword);
    }
    console.log(keywordArray);
  }

  const data = {
    id,
    snippet,
    statistics: formattedStatistics,
    brandingSettings: { ...brandSettingObjects, channel: { ...channnelObjects, keywords: keywordArray } },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  return data;
};
