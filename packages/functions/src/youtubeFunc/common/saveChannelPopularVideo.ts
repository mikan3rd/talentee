import admin from "firebase-admin";
import { youtube_v3 } from "googleapis";

import { youtubeService } from "../../common/config";
import { YoutubeVideoCollectionPath } from "../../firebase/collectionPath";

import { formatVideoData } from "./formatYoutubeData";
import { getChannelPopularVideo } from "./getChannelPopularVideo";

const { FieldValue } = admin.firestore;

export const saveChannelPopularVideo = async (
  channelId: string,
  videoCategories: youtube_v3.Schema$VideoCategory[],
) => {
  const db = admin.firestore();
  const youtubeVideoCollection = db.collection(YoutubeVideoCollectionPath);

  const videoIds = await getChannelPopularVideo(channelId);
  if (!videoIds.length) {
    return { uniqueVideoCategoryIds: [], uniqueVideoCategories: [] };
  }

  const videoResponse = await youtubeService.videos.list({
    part: ["id", "snippet", "contentDetails", "statistics", "player"],
    hl: "ja",
    regionCode: "JP",
    id: videoIds.slice(0, 49),
  });

  const videoCategoryIdsObject: { [key: string]: number } = {};

  for (const item of videoResponse.data.items) {
    const {
      id,
      snippet: { categoryId },
    } = item;
    const data = formatVideoData(item);
    const videoRef = youtubeVideoCollection.doc(id);
    const videoDoc = await youtubeVideoCollection.doc(id).get();

    const targetVideoCategory = videoCategories.find((category) => categoryId === category.id);

    const videoData = {
      ...data,
      videoCategory: targetVideoCategory,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (videoDoc.exists) {
      delete videoData.createdAt;
    }

    await videoRef.set(videoData, { merge: true });

    if (!videoCategoryIdsObject[categoryId]) {
      videoCategoryIdsObject[categoryId] = 0;
    }
    videoCategoryIdsObject[categoryId] += 1;
  }

  const videoCategoryIds = Object.entries(videoCategoryIdsObject)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => (a.value > b.value ? -1 : 1))
    .map(({ key, value }) => key);

  const uniqueVideoCategories = videoCategoryIds.map((categoryId) =>
    videoCategories.find((category) => category.id === categoryId),
  );

  return {
    videoCategoryIds,
    uniqueVideoCategories,
    mainVideoCategoryId: videoCategoryIds[0],
    mainVideoCategory: uniqueVideoCategories[0],
  };
};
