import admin from "../firebase/nodeApp";
import { AccountCollectionPath, TwitterTweetCollectionPath, YoutubeVideoCollectionPath } from "../firebase/firestore";

export const getAccountPageData = async (accountId: string) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeVideoCollection = db.collection(YoutubeVideoCollectionPath);
  const tweetCollection = db.collection(TwitterTweetCollectionPath);

  const accountDoc = await accountCollection.doc(accountId).get();

  if (!accountDoc.exists) {
    return null;
  }

  const accountData = accountDoc.data() as IAccountData;
  let youtubeData: IYoutubeData | null = null;
  let twitterUserData: TwitterUserDataType | null = null;
  let tiktokUserData: TiktokUserDataType | null = null;
  const youtubePopularVideos: IYoutubeVideoData[] = [];
  const popularTweets: TweetObjectType[] = [];

  const { youtubeMainRef, twitterMainRef, tiktokMainRef } = accountData;
  if (youtubeMainRef) {
    const youtubeDoc = await youtubeMainRef.get();
    if (youtubeDoc.exists) {
      const data = youtubeDoc.data();
      youtubeData = { ...data, updatedAt: Math.floor(data.updatedAt.toDate().getTime() / 1000) } as IYoutubeData;

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
      const data = twitterDoc.data() as TwitterUserObjectType;
      twitterUserData = {
        ...data,
        created_at: Math.floor(data.created_at.toDate().getTime() / 1000),
        createdAt: Math.floor(data.createdAt.toDate().getTime() / 1000),
        updatedAt: Math.floor(data.updatedAt.toDate().getTime() / 1000),
      };

      const authorId = data.id;
      const popularTweetDocs = await tweetCollection
        .where("author_id", "==", authorId)
        .orderBy("public_metrics.retweet_count", "desc")
        .limit(3)
        .get();

      if (!popularTweetDocs.empty) {
        popularTweetDocs.forEach((doc) => {
          popularTweets.push(doc.data() as TweetObjectType);
        });
      }
    }
  }

  if (tiktokMainRef) {
    const tiktokDoc = await tiktokMainRef.get();
    if (tiktokDoc.exists) {
      const data = tiktokDoc.data() as TiktokUserObjectType;
      tiktokUserData = {
        ...data,
        createdAt: Math.floor(data.createdAt.toDate().getTime() / 1000),
        updatedAt: Math.floor(data.updatedAt.toDate().getTime() / 1000),
      };
    }
  }

  return JSON.stringify({
    accountData,
    youtubeData,
    youtubePopularVideos,
    twitterUserData,
    popularTweets,
    tiktokUserData,
  });
};
