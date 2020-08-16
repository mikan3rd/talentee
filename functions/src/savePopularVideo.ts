import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { google } from "googleapis";

import { YoutubeVideoCollectionPath } from "./firebase/collectionPath";
import { formatVideoData } from "./utils/formatYoutubeData";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

const { FieldValue } = admin.firestore;

export const savePopularVideo = async (channelId: string) => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  const db = admin.firestore();
  const youtubeVideoCollection = db.collection(YoutubeVideoCollectionPath);

  const videoSearchResponse = await service.search.list({
    part: ["id", "snippet"],
    type: ["video"],
    regionCode: "JP",
    relevanceLanguage: "ja",
    order: "viewCount",
    maxResults: 50,
    channelId,
  });

  const videoIds = videoSearchResponse.data.items.map((item) => item.id.videoId);

  const videoResponse = await service.videos.list({
    part: ["id", "snippet", "contentDetails", "statistics", "player"],
    hl: "ja",
    regionCode: "JP",
    id: videoIds,
  });

  const videoCategoryIds: string[] = [];

  for (const item of videoResponse.data.items) {
    const {
      id,
      snippet: { categoryId },
    } = item;
    const data = formatVideoData(item);
    const videoRef = youtubeVideoCollection.doc(id);
    const videoDoc = await youtubeVideoCollection.doc(id).get();

    const videoData = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (videoDoc.exists) {
      delete videoData.createdAt;
    }

    await videoRef.set(videoData, { merge: true });

    videoCategoryIds.push(categoryId);
  }

  return { videoCategoryIds: Array.from(new Set(videoCategoryIds)) };
};
