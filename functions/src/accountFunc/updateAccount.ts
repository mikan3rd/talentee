import { PubSub } from "@google-cloud/pubsub";
import { youtube_v3 } from "googleapis";

import { toBufferJson } from "../common/utils";
import {
  PopularTweetTopic,
  PopularTweetsonType,
  PopularVideoJsonType,
  PopularVideoTopic,
  ServiceAccountByYoutubeJsonType,
  ServiceAccountByYoutubeTopic,
  UpsertInstagramUserJsonType,
  UpsertInstagramUserTopic,
  UpsertTiktokUserJsonType,
  UpsertTiktokUserTopic,
  UpsertTwitterUserJsonType,
  UpsertTwitterUserTopic,
  UpsertYoutubeChannelJsonType,
  UpsertYoutubeChannelTopic,
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
  if (youtubeMainRef) {
    const { id } = (await youtubeMainRef.get()).data();

    const channelTopicdata: UpsertYoutubeChannelJsonType = { channelId: id, accountId };
    await pubSub.topic(UpsertYoutubeChannelTopic).publish(toBufferJson(channelTopicdata));

    const videoTopicdata: PopularVideoJsonType = { channelId: id, videoCategories };
    await pubSub.topic(PopularVideoTopic).publish(toBufferJson(videoTopicdata));

    const topicData: ServiceAccountByYoutubeJsonType = { channelId: id };
    await pubSub.topic(ServiceAccountByYoutubeTopic).publish(toBufferJson(topicData));
  }

  if (twitterMainRef) {
    const { id, username } = (await twitterMainRef.get()).data() as TwitterUserDataType;
    const twitterUserTopicData: UpsertTwitterUserJsonType = { accountId, username };
    await pubSub.topic(UpsertTwitterUserTopic).publish(toBufferJson(twitterUserTopicData));

    const tweetTopicdata: PopularTweetsonType = { username, userId: id };
    await pubSub.topic(PopularTweetTopic).publish(toBufferJson(tweetTopicdata));
  }

  if (instagramMainRef) {
    const { username } = (await instagramMainRef.get()).data() as InstagramUserType;
    const instagramUserTopicData: UpsertInstagramUserJsonType = { accountId, username };
    await pubSub.topic(UpsertInstagramUserTopic).publish(toBufferJson(instagramUserTopicData));
  }

  if (tiktokMainRef) {
    const {
      user: { uniqueId },
    } = (await tiktokMainRef.get()).data() as TiktokUserType;
    const tiktokUserTopicData: UpsertTiktokUserJsonType = { accountId, uniqueId };
    await pubSub.topic(UpsertTiktokUserTopic).publish(toBufferJson(tiktokUserTopicData));
  }

  return true;
};
