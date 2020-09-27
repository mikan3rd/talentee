import { PubSub } from "@google-cloud/pubsub";
import { youtube_v3 } from "googleapis";

import { toBufferJson } from "../common/utils";
import {
  PopularTweetsonType,
  PopularVideoJsonType,
  ServiceAccountJsonType,
  Topic,
  UpsertInstagramUserJsonType,
  UpsertTiktokUserJsonType,
  UpsertTwitterUserJsonType,
  UpsertYoutubeChannelJsonType,
} from "../firebase/topic";
import { AccountCollectionPath, db } from "../firebase/collectionPath";

export const updateAccount = async (accountId: string, videoCategories: youtube_v3.Schema$VideoCategory[]) => {
  const accountCollection = db.collection(AccountCollectionPath);
  const accountRef = accountCollection.doc(accountId);
  const accountDoc = await accountRef.get();

  if (!accountDoc.exists) {
    console.log(`NOT FOUND, accountId: ${accountId}`);
    return false;
  }

  const { youtubeMainRef, twitterMainRef, instagramMainRef, tiktokMainRef } = accountDoc.data() as IAccountData;

  const pubSub = new PubSub();

  const topicData: ServiceAccountJsonType = { accountId };
  await pubSub.topic(Topic.ServiceAccount).publish(toBufferJson(topicData));

  if (youtubeMainRef) {
    const { id } = (await youtubeMainRef.get()).data();

    const channelTopicdata: UpsertYoutubeChannelJsonType = { channelId: id, accountId };
    await pubSub.topic(Topic.UpsertYoutubeChannel).publish(toBufferJson(channelTopicdata));

    const videoTopicdata: PopularVideoJsonType = { channelId: id, videoCategories };
    await pubSub.topic(Topic.PopularVideo).publish(toBufferJson(videoTopicdata));
  }

  if (twitterMainRef) {
    const { id, username } = (await twitterMainRef.get()).data() as TwitterUserDataType;
    const twitterUserTopicData: UpsertTwitterUserJsonType = { accountId, username };
    await pubSub.topic(Topic.UpsertTwitterUser).publish(toBufferJson(twitterUserTopicData));

    const tweetTopicdata: PopularTweetsonType = { username, userId: id };
    await pubSub.topic(Topic.PopularTweet).publish(toBufferJson(tweetTopicdata));
  }

  if (instagramMainRef) {
    const { username } = (await instagramMainRef.get()).data() as InstagramUserType;
    const instagramUserTopicData: UpsertInstagramUserJsonType = { accountId, username };
    await pubSub.topic(Topic.UpsertInstagramUser).publish(toBufferJson(instagramUserTopicData));
  }

  if (tiktokMainRef) {
    const {
      user: { uniqueId },
    } = (await tiktokMainRef.get()).data() as TiktokUserType;
    const tiktokUserTopicData: UpsertTiktokUserJsonType = { accountId, uniqueId };
    await pubSub.topic(Topic.UpsertTiktokUser).publish(toBufferJson(tiktokUserTopicData));
  }

  return true;
};
