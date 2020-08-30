import * as admin from "firebase-admin";

import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";
import { PopularVideoJsonType } from "../firebase/topic";

import { saveChannelPopularVideo } from "./common/saveChannelPopularVideo";

export const updateVideo = async (data: PopularVideoJsonType) => {
  const { channelId, videoCategories } = data;

  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const { uniqueVideoCategoryIds, uniqueVideoCategories } = await saveChannelPopularVideo(channelId, videoCategories);
  const channnelData = {
    videoCategoryIds: uniqueVideoCategoryIds,
    videoCategories: uniqueVideoCategories,
  };
  youtubeChannelCollection.doc(channelId).set(channnelData, { merge: true });
};
