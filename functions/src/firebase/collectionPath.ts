import * as admin from "firebase-admin";

export const db = admin.firestore();

export const AccountCollectionPath = "account" as const;

export const YoutubeChannelCollectionPath = "youtubeChannel" as const;
export const YoutubeVideoCollectionPath = "youtubeVideo" as const;

export const TwitterUserCollectionPath = "twitterUser" as const;
export const TwitterTweetCollectionPath = "twitterTweet" as const;
export const TwitterBotCollectionPath = "twitterBot" as const;

export const tweetAccountRef = db.collection(TwitterBotCollectionPath).doc("tweetAccount");
