import * as admin from "firebase-admin";

import { TwitterTweetCollectionPath, db } from "../firebase/collectionPath";

import { crawlSearchTweet } from "./common/crawlSearchTweet";
import { getTweetIdByUrl } from "./common/getTweetIdByUrl";
import { getTweets } from "./common/api";
import { formatTweetData } from "./common/formatUserData";

const { FieldValue } = admin.firestore;

export const getPopularTweet = async () => {
  const username = "monst_mixi";
  const linkUrls = await crawlSearchTweet(username);
  const tweetIds = linkUrls.map((url) => getTweetIdByUrl(url));
  console.log(JSON.stringify({ tweetIds }));

  const { data } = await getTweets(tweetIds);

  const tweetCollection = db.collection(TwitterTweetCollectionPath);

  for (const tweetObject of data) {
    const tweetData = formatTweetData(tweetObject);
    const tweetRef = tweetCollection.doc(tweetData.id);
    const tweetDoc = await tweetRef.get();

    const firestoreTweetData = {
      ...tweetData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (tweetDoc.exists) {
      delete firestoreTweetData.createdAt;
    }

    await tweetRef.set(firestoreTweetData, { merge: true });
  }
};
