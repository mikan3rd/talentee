import * as admin from "firebase-admin";

import { YoutubeChannelCollectionPath } from "../firebase/collectionPath";

export const deleteChannel = async () => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const channelDocs = await youtubeChannelCollection.where("statistics.subscriberCount", "<", 10000).get();

  const channelDataArray: FirebaseFirestore.DocumentData[] = [];
  channelDocs.forEach((doc) => {
    const data = doc.data();
    doc.id;
    channelDataArray.push({ docId: doc.id, ...data });
  });

  for (const channelData of channelDataArray) {
    if (channelData.statistics.viewCount >= 1000000) {
      continue;
    }
    console.log(channelData.docId);
    const accountDoc = await channelData.accountRef.get();
    if (accountDoc.exists) {
      await channelData.accountRef.delete();
    }
    await youtubeChannelCollection.doc(channelData.docId).delete();
  }
};
