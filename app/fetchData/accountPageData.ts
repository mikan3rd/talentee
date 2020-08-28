import admin from "../firebase/nodeApp";
import { AccountCollectionPath, YoutubeVideoCollectionPath } from "../firebase/firestore";

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
  let twitterUserData = null;

  const { youtubeMainRef, twitterMainRef } = accountData;
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

  if (twitterMainRef) {
    const twitterDoc = await twitterMainRef.get();
    if (twitterDoc.exists) {
      const data = twitterDoc.data();
      twitterUserData = { ...data, updatedAt: Math.floor(data.updatedAt.toDate().getTime() / 1000) };
    }
  }

  return JSON.stringify({ accountData, youtubeData, youtubePopularVideos, twitterUserData });
};
