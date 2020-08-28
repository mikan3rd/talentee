import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";
import * as dayjs from "dayjs";

import { ServiceAccountByYoutubeJsonType, ServiceAccountByYoutubeTopic } from "../firebase/topic";
import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";

export const batchUpdateServiceAccount = async () => {
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

  const pubSub = new PubSub();
  for (const channel of channelDataArray) {
    const data: ServiceAccountByYoutubeJsonType = { channelId: channel.id };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(ServiceAccountByYoutubeTopic).publish(dataBuffer);
  }
};
