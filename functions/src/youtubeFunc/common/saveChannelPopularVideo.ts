import * as admin from "firebase-admin";
import { youtube_v3 } from "googleapis";

import { YoutubeVideoCollectionPath } from "../../firebase/collectionPath";
import { youtubeService } from "../../common/config";

import { getChannelPopularVideo } from "./getChannelPopularVideo";
import { formatVideoData } from "./formatYoutubeData";

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

  const videoCategoryIds: string[] = [];

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

    videoCategoryIds.push(categoryId);
  }

  const uniqueVideoCategoryIds = Array.from(new Set(videoCategoryIds));
  const uniqueVideoCategories = videoCategories.filter((category) => uniqueVideoCategoryIds.includes(category.id));

  return { uniqueVideoCategoryIds, uniqueVideoCategories };
};
