import admin from "../firebase/nodeApp";
import { AccountCollectionPath, YoutubeVideoCollectionPath } from "../firebase/firestore";

export interface IAccountData {
  tmpUsername: string;
  thumbnailUrl: string;
  youtubeMainRef: FirebaseFirestore.DocumentReference;
}

export interface IYoutubeVideoData {
  id: string;
  snippet: { title: string; description: string; publishedAt: string; tags: string[] };
  statistics: { viewCount: number; likeCount?: number; dislikeCount?: number };
  player: { embedHtml: string };
  videoCategory: { snippet: { title: string } };
}

export const getAccountPageData = async (accountId: string) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeVideoCollection = db.collection(YoutubeVideoCollectionPath);

  const accountDoc = await accountCollection.doc(accountId).get();

  if (!accountDoc.exists) {
    return null;
  }

  const accountData = accountDoc.data() as IAccountData;
  let youtubeData = null;
  const youtubePopularVideos = [];

  const { youtubeMainRef } = accountData;
  if (youtubeMainRef) {
    const youtubeDoc = await youtubeMainRef.get();
    if (youtubeDoc.exists) {
      const data = youtubeDoc.data();
      youtubeData = { ...data, updatedAt: Math.floor(data.updatedAt.toDate().getTime() / 1000) };

      const channelId = data.id;
      const popularVideoDocs = await youtubeVideoCollection
        .where("snippet.channelId", "==", channelId)
        .orderBy("statistics.viewCount", "desc")
        .limit(3)
        .get();

      if (!popularVideoDocs.empty) {
        popularVideoDocs.forEach((doc) => {
          youtubePopularVideos.push(doc.data() as IYoutubeVideoData);
        });
      }
    }
  }

  return JSON.stringify({ accountData, youtubeData, youtubePopularVideos });
};
