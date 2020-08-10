import admin from "../firebase/nodeApp";
import { AccountCollectionPath } from "../firebase/firestore";

export interface IAccountData {
  tmpUsername: string;
  thumbnailUrl: string;
}

export const getAccountPageData = async (accountId: string) => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const accountDoc = await accountCollection.doc(accountId).get();

  if (!accountDoc.exists) {
    return null;
  }

  const accountData = accountDoc.data();
  let youtubeData = null;

  const { youtubeMainRef } = accountData;
  if (youtubeMainRef) {
    const youtubeDoc = await youtubeMainRef.get();
    if (youtubeDoc.exists) {
      youtubeData = youtubeDoc.data();
    }
  }

  return JSON.stringify({ accountData, youtubeData });
};