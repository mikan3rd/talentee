import * as admin from "firebase-admin";

import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";
import { PopularVideoJsonType } from "../firebase/topic";

import { saveChannelPopularVideo } from "./common/saveChannelPopularVideo";

export const updateVideo = async (data: PopularVideoJsonType) => {
  const { channel, videoCategories } = data;

  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const { uniqueVideoCategoryIds, uniqueVideoCategories } = await saveChannelPopularVideo(channel.id, videoCategories);
  const channnelData = {
    videoCategoryIds: uniqueVideoCategoryIds,
    videoCategories: uniqueVideoCategories,
  };
  youtubeChannelCollection.doc(channel.id).set(channnelData, { merge: true });
};
