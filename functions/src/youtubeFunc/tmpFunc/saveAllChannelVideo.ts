import * as admin from "firebase-admin";

import { YoutubeChannelCollectionPath } from "../../firebase/collectionPath";
import { getVideoCategories } from "../common/getVideoCategories";
import { saveChannelPopularVideo } from "../common/saveChannelPopularVideo";

export const saveAllChannelVideo = async () => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const docs = await youtubeChannelCollection.orderBy("statistics.subscriberCount", "desc").get();

  const channelDataArray: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    channelDataArray.push(data);
  });

  const videoCategories = await getVideoCategories();

  let num = 1;
  for (const channel of channelDataArray) {
    console.log("num:", num, "channel:", channel.id);
    const { uniqueVideoCategoryIds, uniqueVideoCategories } = await saveChannelPopularVideo(
      channel.id,
      videoCategories,
    );
    const channnelData = {
      videoCategoryIds: uniqueVideoCategoryIds,
      videoCategories: uniqueVideoCategories,
    };
    youtubeChannelCollection.doc(channel.id).set(channnelData, { merge: true });
    num += 1;
  }
};
