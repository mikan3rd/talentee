import * as admin from "firebase-admin";

import { AccountCollectionPath } from "../firebase/collectionPath";

export const updateAccount = async (accountId: string) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const accountDoc = await accountRef.get();
  const { youtubeMainRef, twitterMainRef } = accountDoc.data() as IAccountData;

  if (youtubeMainRef) {
    //
  }

  if (twitterMainRef) {
    //
  }
};
