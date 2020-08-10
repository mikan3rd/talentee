import admin from "../firebase/nodeApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

export const getIndexPageData = async () => {
  const db = admin.firestore();
  const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
  const youtubeDocs = await youtubeCollection.orderBy("statistics.subscriberCount", "desc").limit(5).get();
  const youtubeData: FirebaseFirestore.DocumentData = [];
  youtubeDocs.forEach((doc) => {
    const data = doc.data();
    youtubeData.push(data);
  });
  return JSON.stringify(youtubeData);
};
