import { PubSub } from "@google-cloud/pubsub";

import {
  AccountCollectionPath,
  InstagramUserCollectionPath,
  TiktokUserCollectionPath,
  TwitterUserCollectionPath,
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
import { crawlOtherServiceLink } from "../youtubeFunc/common/crawlOtherServiceLink";
import { getUserById } from "../twitterFunc/common/api";
import { getUserDetail } from "../tiktokFunc/common/getUserDetail";

export const getServiceAccount = async (accountId: string) => {
  const accountCollection = db.collection(AccountCollectionPath);
  const accountRef = accountCollection.doc(accountId);
  const accountDoc = await accountRef.get();
  const { youtubeMainRef, twitterMainRef, tiktokMainRef } = accountDoc.data() as IAccountData;

  let linkUrls: string[] = [];

  if (youtubeMainRef) {
    const { id } = (await youtubeMainRef.get()).data();
    const urls = await crawlOtherServiceLink(id);
    linkUrls = linkUrls.concat(urls);
  }

  if (twitterMainRef) {
    const { id } = (await twitterMainRef.get()).data() as TwitterUserDataType;
    const {
      data: { url },
    } = await getUserById(id);
    linkUrls.push(url);
  }

  if (tiktokMainRef) {
    const {
      user: { uniqueId },
    } = (await tiktokMainRef.get()).data() as TiktokUserType;
    const {
      userData: {
        user: {
          bioLink: { link },
        },
      },
    } = await getUserDetail(uniqueId);
    linkUrls.push(link);
  }

  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

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
