import * as admin from "firebase-admin";

import { AccountCollectionPath, YoutubeChannelCollectionPath } from "../../firebase/collectionPath";

const { FieldValue } = admin.firestore;

export const updateChannel = async (accountId: string, channelData) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const youtubeMainRef = youtubeChannelCollection.doc(channelData.id);

  const youtubeData = {
    ...channelData,
    accountRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await youtubeMainRef.set(youtubeData, { merge: true });

  const { twitterMainRef } = (await accountRef.get()).data();
  const accountData: IAccountData = {
    tmpUsername: channelData.snippet.title,
    thumbnailUrl: channelData.snippet.thumbnails.medium.url,
    youtubeMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (twitterMainRef) {
    delete accountData.tmpUsername;
    delete accountData.thumbnailUrl;
  }

  await accountRef.set(accountData, { merge: true });
};
