import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";

import { toBufferJson } from "../common/utils";
import { ServiceAccountByYoutubeJsonType, ServiceAccountByYoutubeTopic } from "../firebase/topic";
import { AccountCollectionPath } from "../firebase/collectionPath";
import { getUserById } from "../twitterFunc/common/api";
import { formatTwitterUserData } from "../twitterFunc/common/formatUserData";
import { updateTwitterUser } from "../twitterFunc/common/updateTwitterUser";

export const updateAccount = async (accountId: string) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const accountDoc = await accountRef.get();
  const { youtubeMainRef, twitterMainRef } = accountDoc.data() as IAccountData;

  const pubSub = new PubSub();
  if (youtubeMainRef) {
    const { id } = (await youtubeMainRef.get()).data();
    const data: ServiceAccountByYoutubeJsonType = { channelId: id };
    await pubSub.topic(ServiceAccountByYoutubeTopic).publish(toBufferJson(data));
  }

  if (twitterMainRef) {
    const { id } = (await twitterMainRef.get()).data() as TwitterUserDataType;
    const {
      data: { data },
    } = await getUserById(id);
    const twitterUser = formatTwitterUserData(data);
    await updateTwitterUser(accountId, twitterUser);
  }
};
