import * as admin from "firebase-admin";
import * as dayjs from "dayjs";
import { PubSub } from "@google-cloud/pubsub";

import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";
import { PopularVideoJsonType, PopularVideoTopic } from "../firebase/topic";

import { getVideoCategories } from "./common/getVideoCategories";

export const updateRecentVideo = async () => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const now = dayjs().add(9, "hour");
  const updatedAt = now.subtract(1, "day");
  const docs = await youtubeChannelCollection.where("updatedAt", ">=", updatedAt.toDate()).get();

  const channelDataArray: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    channelDataArray.push(data);
  });

  console.log("channelDataArray:", channelDataArray.length);

  const videoCategories = await getVideoCategories();

  const pubSub = new PubSub();
  for (const channel of channelDataArray) {
    const data: PopularVideoJsonType = { channel, videoCategories };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(PopularVideoTopic).publish(dataBuffer);
  }
};
