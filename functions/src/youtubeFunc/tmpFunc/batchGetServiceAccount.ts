import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";

import { ServiceAccountByYoutubeJsonType, ServiceAccountByYoutubeTopic } from "../../firebase/topic";
import { YoutubeChannelCollectionPath } from "../../firebase/collectionPath";

export const batchGetServiceAccount = async () => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const docs = await youtubeChannelCollection.orderBy("statistics.subscriberCount", "desc").get();

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
