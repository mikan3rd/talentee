import admin from "firebase-admin";
import { youtube_v3 } from "googleapis";

import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";

import { saveChannelPopularVideo } from "./common/saveChannelPopularVideo";

export const updateVideo = async (channelId: string, videoCategories: youtube_v3.Schema$VideoCategory[]) => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const {
    videoCategoryIds,
    uniqueVideoCategories,
    mainVideoCategoryId,
    mainVideoCategory,
  } = await saveChannelPopularVideo(channelId, videoCategories);

  const channnelData = {
    mainVideoCategoryId,
    mainVideoCategory,
    videoCategoryIds,
    videoCategories: uniqueVideoCategories,
  };

  youtubeChannelCollection.doc(channelId).set(channnelData, { merge: true });
};
