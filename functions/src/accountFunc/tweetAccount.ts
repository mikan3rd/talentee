import { toUnitString } from "../common/utils";
import { YoutubeChannelCollectionPath, db, tweetAccountRef } from "../firebase/collectionPath";
import { TwitterClient } from "../twitterFunc/common/TwitterClient";

type TweetAccountDataType = {
  youtubeStartAfterId: string;
};

const accountUrl = (accountId: string) => `https://talentee.jp/account/${accountId}`;

export const tweetAccountByYoutube = async () => {
  const doc = await tweetAccountRef.get();
  let tweetAccoutData: TweetAccountDataType = { youtubeStartAfterId: null };
  if (doc.exists) {
    tweetAccoutData = doc.data() as TweetAccountDataType;
  }

  const { youtubeStartAfterId } = tweetAccoutData;
  let query = db.collection(YoutubeChannelCollectionPath).orderBy("statistics.subscriberCount", "desc");
  if (youtubeStartAfterId) {
    const startAfterDoc = await db.collection(YoutubeChannelCollectionPath).doc(youtubeStartAfterId).get();
    query = query.startAfter(startAfterDoc);
  }
  const youtubeDocs = await query.limit(1).get();

  let youtubeData: YoutubeData;
  youtubeDocs.forEach((doc) => {
    youtubeData = doc.data() as YoutubeData;
  });

  const accountDoc = await youtubeData.accountRef.get();
  const accountId = accountDoc.id;
  const {
    snippet: { title },
    statistics: { subscriberCount, videoCount, viewCount },
  } = youtubeData;

  const client = TwitterClient.getBot();
  const status = [
    `【人気YouTuberまとめ】`,
    ``,
    title,
    ``,
    `【チャンネル登録者数】${toUnitString(subscriberCount)}人`,
    `【再生回数】${toUnitString(viewCount)}回`,
    `【動画投稿数】${toUnitString(videoCount)}本`,
    accountUrl(accountId),
  ].join("\n");

  console.log(JSON.stringify(status));

  await client.postTweet(status);

  tweetAccoutData.youtubeStartAfterId = youtubeData.id;
  await tweetAccountRef.set(tweetAccoutData, { merge: true });
};
