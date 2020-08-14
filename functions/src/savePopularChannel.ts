import * as admin from "firebase-admin";
import { google, youtube_v3 } from "googleapis";
import * as dayjs from "dayjs";
import * as functions from "firebase-functions";

import { AccountCollectionPath, YoutubeChannelCollectionPath } from "./collectionPath";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

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
  const accountCollection = db.collection(AccountCollectionPath);

  let createNum = 0;
  let updateNum = 0;
  let skipNum = 0;
  const result = [];
  for (const item of channelResponse.data.items) {
    const {
      id,
      snippet: { country },
    } = item;

    if (country !== "JP") {
      skipNum += 1;
      continue;
    }

    const youtubeMainRef = youtubeChannelCollection.doc(id);
    const youtubeDoc = await youtubeMainRef.get();

    let accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeMainRef).limit(1).get();
    if (accountDocs.empty) {
      const accountData = {
        tmpUsername: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        youtubeMainRef,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await accountCollection.doc().set(accountData, { merge: true });
      accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeMainRef).limit(1).get();
    }

    let accountRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    accountDocs.forEach((doc) => {
      accountRef = accountCollection.doc(doc.id);
    });

    const data = formatChannelData(item);
    const youtubeData = {
      ...data,
      accountRef,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (youtubeDoc.exists) {
      delete youtubeData.createdAt;
      updateNum += 1;
    } else {
      createNum += 1;
    }

    await youtubeMainRef.set(youtubeData, { merge: true });

    result.push(youtubeData);
  }

  console.log("createNum:", createNum);
  console.log("updateNum:", updateNum);
  console.log("skipNum:", skipNum);

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
    if (typeof value === "string" && !isNaN(Number(value))) {
      formattedStatistics[key] = Number(value);
    } else {
      formattedStatistics[key] = value;
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
  }

  const data = {
    id,
    snippet,
    statistics: formattedStatistics,
    brandingSettings: { ...brandSettingObjects, channel: { ...channnelObjects, keywords: keywordArray } },
  };
  return data;
};
