import { PubSub } from "@google-cloud/pubsub";

import {
  InstagramUserCollectionPath,
  TiktokUserCollectionPath,
  TwitterUserCollectionPath,
  YoutubeChannelCollectionPath,
  db,
} from "../firebase/collectionPath";
import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";
import {
  UpsertInstagramUserJsonType,
  UpsertInstagramUserTopic,
  UpsertTiktokUserJsonType,
  UpsertTiktokUserTopic,
  UpsertTwitterUserJsonType,
  UpsertTwitterUserTopic,
} from "../firebase/topic";
import { toBufferJson } from "../common/utils";

import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async (channelId: string) => {
  const linkUrls = await crawlOtherServiceLink(channelId);
  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);
  const youtubeChannel = await youtubeChannelCollection.doc(channelId).get();

  if (!youtubeChannel.exists) {
    return false;
  }
  const channelData = youtubeChannel.data();
  const accountId = channelData.accountRef.id;

  const pubSub = new PubSub();
  for (const serviceAccount of serviceAccounts) {
    const { serviceName, items } = serviceAccount;
    const firstItem = items[0];
    const { username } = firstItem;

    if (!username) {
      continue;
    }

    if (serviceName === "twitter") {
      const twitterUserDoc = await db
        .collection(TwitterUserCollectionPath)
        .where("username", "==", username)
        .limit(1)
        .get();

      if (!twitterUserDoc.empty) {
        continue;
      }

      const twitterUserTopicData: UpsertTwitterUserJsonType = { accountId, username };
      await pubSub.topic(UpsertTwitterUserTopic).publish(toBufferJson(twitterUserTopicData));
    }

    if (serviceName === "instagram") {
      const instagramUserDoc = await db
        .collection(InstagramUserCollectionPath)
        .where("username", "==", username)
        .limit(1)
        .get();

      if (!instagramUserDoc.empty) {
        continue;
      }

      const instagramUserTopicData: UpsertInstagramUserJsonType = { accountId, username };
      await pubSub.topic(UpsertInstagramUserTopic).publish(toBufferJson(instagramUserTopicData));
    }

    if (serviceName === "tiktok") {
      const tiktokUserDoc = await db
        .collection(TiktokUserCollectionPath)
        .where("uniqueId", "==", username)
        .limit(1)
        .get();

      if (!tiktokUserDoc.empty) {
        continue;
      }

      const tiktokUserTopicData: UpsertTiktokUserJsonType = { accountId, uniqueId: username };
      await pubSub.topic(UpsertTiktokUserTopic).publish(toBufferJson(tiktokUserTopicData));
    }
  }

  return true;
};
