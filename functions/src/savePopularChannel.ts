import * as admin from "firebase-admin";
import * as dayjs from "dayjs";
import * as functions from "firebase-functions";
import { google, youtube_v3 } from "googleapis";

import { AccountCollectionPath, YoutubeChannelCollectionPath } from "./firebase/collectionPath";
import { formatChannelData } from "./utils/formatYoutubeData";
import { getVideoCategories } from "./utils/getVideoCategories";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

const { FieldValue } = admin.firestore;

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
  const uniqueChannelIds = Array.from(new Set(channnelIds));

  const channelResponse = await service.channels.list({
    part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
    id: uniqueChannelIds,
  });

  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  let createNum = 0;
  let updateNum = 0;
  let skipNum = 0;

  for (const item of channelResponse.data.items) {
    const {
      id,
      snippet: { country },
    } = item;

    if (country !== "JP") {
      skipNum += 1;
      continue;
    }

    const data = formatChannelData(item);
    if (data.statistics.subscriberCount <= 10000 && data.statistics.viewCount <= 1000000) {
      skipNum += 1;
      continue;
    }

    const youtubeRef = youtubeChannelCollection.doc(id);
    const youtubeDoc = await youtubeRef.get();

    let accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeRef).limit(1).get();
    if (accountDocs.empty) {
      const accountData = {
        tmpUsername: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        youtubeMainRef: youtubeRef,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await accountCollection.doc().set(accountData, { merge: true });
      accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeRef).limit(1).get();
    }

    let accountRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    accountDocs.forEach((doc) => {
      accountRef = accountCollection.doc(doc.id);
    });

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

    await youtubeRef.set(youtubeData, { merge: true });
  }

  console.log("createNum:", createNum, "updateNum:", updateNum, "skipNum:", skipNum);
};
