import { PubSub } from "@google-cloud/pubsub";

import { YoutubeChannelCollectionPath, db } from "../firebase/collectionPath";
import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";
import { TwitterError, TwitterNotFound, getUserByUsername } from "../twitterFunc/common/api";
import { formatTwitterUserData } from "../twitterFunc/common/formatUserData";
import { upsertTwitterUserByChannelId } from "../twitterFunc/common/upsertTwitterUserByChannelId";
import { UpsertInstagramUserJsonType, UpsertInstagramUserTopic } from "../firebase/topic";
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
    if (serviceName === "twitter") {
      if (!firstItem.username) {
        continue;
      }
      try {
        const { data } = await getUserByUsername(firstItem.username);
        const twitterUser = formatTwitterUserData(data);
        await upsertTwitterUserByChannelId(twitterUser, channelId);
      } catch (e) {
        if (e instanceof TwitterError && e.name === TwitterNotFound) {
          continue;
        } else {
          throw e;
        }
      }
    }

    if (serviceName === "instagram") {
      if (!firstItem.username) {
        continue;
      }
      const instagramUserTopicData: UpsertInstagramUserJsonType = { accountId, username: firstItem.username };
      await pubSub.topic(UpsertInstagramUserTopic).publish(toBufferJson(instagramUserTopicData));
    }
  }

  return true;
};
