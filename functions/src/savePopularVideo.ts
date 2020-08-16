import * as admin from "firebase-admin";
import * as dayjs from "dayjs";

import { YoutubeChannelCollectionPath } from "./firebase/collectionPath";
import { getVideoCategories } from "./common/getVideoCategories";
import { saveChannelPopularVideo } from "./common/saveChannelPopularVideo";

export const savePopularVideo = async () => {
  const db = admin.firestore();
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const now = dayjs().add(9, "hour");
  const updatedAt = now.subtract(1, "day");
  const docs = await youtubeChannelCollection.where("updatedAt", ">=", updatedAt).get();

  const channelDataArray: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    channelDataArray.push(data);
  });

  const videoCategories = await getVideoCategories();

  for (const channel of channelDataArray) {
    const { uniqueVideoCategoryIds, uniqueVideoCategories } = await saveChannelPopularVideo(
      channel.id,
      videoCategories,
    );
    const channnelData = {
      videoCategoryIds: uniqueVideoCategoryIds,
      videoCategories: uniqueVideoCategories,
    };
    youtubeChannelCollection.doc(channel.id).set(channnelData, { merge: true });
  }
};
