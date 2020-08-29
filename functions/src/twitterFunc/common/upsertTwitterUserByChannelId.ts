import * as admin from "firebase-admin";

import {
  AccountCollectionPath,
  TwitterUserCollectionPath,
  YoutubeChannelCollectionPath,
} from "../../firebase/collectionPath";

const { FieldValue } = admin.firestore;

export const upsertTwitterUserByChannelId = async (userData: TwitterUserDataType, channelId: string) => {
  const { id, name, profile_image_url } = userData;

  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);
  const twitterUserCollection = db.collection(TwitterUserCollectionPath);

  const youtubeMainRef = youtubeChannelCollection.doc(channelId);
  const twitterMainRef = twitterUserCollection.doc(id);
  const twitterMainDoc = await twitterMainRef.get();

  const accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeMainRef).limit(1).get();

  let accountDocId: string;
  accountDocs.forEach((doc) => {
    accountDocId = doc.id;
  });
  const accountRef = accountCollection.doc(accountDocId);

  const twitterUserData = {
    ...userData,
    accountRef,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (twitterMainDoc.exists) {
    delete twitterUserData.createdAt;
  }

  await twitterMainRef.set(twitterUserData, { merge: true });

  const accountData: IAccountData = {
    tmpUsername: name,
    thumbnailUrl: profile_image_url,
    twitterMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await accountRef.set(accountData, { merge: true });
};
