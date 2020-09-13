import { PubSub } from "@google-cloud/pubsub";

import { YoutubeChannelCollectionPath, db } from "../firebase/collectionPath";
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

    if (!firstItem.username) {
      continue;
    }

    if (serviceName === "twitter") {
      const instagramUserTopicData: UpsertTwitterUserJsonType = { accountId, username: firstItem.username };
      await pubSub.topic(UpsertTwitterUserTopic).publish(toBufferJson(instagramUserTopicData));
    }

    if (serviceName === "instagram") {
      const instagramUserTopicData: UpsertInstagramUserJsonType = { accountId, username: firstItem.username };
      await pubSub.topic(UpsertInstagramUserTopic).publish(toBufferJson(instagramUserTopicData));
    }

    if (serviceName === "tiktok") {
      const tiktokUserTopicData: UpsertTiktokUserJsonType = { accountId, uniqueId: firstItem.username };
      await pubSub.topic(UpsertTiktokUserTopic).publish(toBufferJson(tiktokUserTopicData));
    }
  }

  return true;
};
