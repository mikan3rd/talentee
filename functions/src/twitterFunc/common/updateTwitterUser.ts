import * as admin from "firebase-admin";

import { AccountCollectionPath, TwitterUserCollectionPath } from "../../firebase/collectionPath";

const { FieldValue } = admin.firestore;

export const updateTwitterUser = async (accountId: string, userData: TwitterUserDataType) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const twitterUserCollection = db.collection(TwitterUserCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const twitterMainRef = twitterUserCollection.doc(userData.id);

  const twitterUserData = {
    ...userData,
    accountRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await twitterMainRef.set(twitterUserData, { merge: true });

  const accountData: IAccountData = {
    tmpUsername: userData.name,
    thumbnailUrl: userData.profile_image_url,
    twitterMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await accountRef.set(accountData, { merge: true });
};
