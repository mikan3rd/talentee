import { AccountCollectionPath, FieldValue, TiktokUserCollectionPath, db } from "../firebase/collectionPath";

import { getUserDetail } from "./common/getUserDetail";

export const upsertUserData = async (accountId: string, uniqueId: string) => {
  console.log(`accountId: ${accountId}, uniqueId: ${uniqueId}`);
  const userData = await getUserDetail(uniqueId);

  const {
    user: { id },
  } = userData;
  if (!accountId || !id) {
    console.error(`NOT FOUND: accountId: ${accountId}, uniqueId: ${uniqueId}`);
    return false;
  }

  const accountCollection = db.collection(AccountCollectionPath);
  const tiktokUserCollection = db.collection(TiktokUserCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const tiktokMainRef = tiktokUserCollection.doc(id);
  const tiktokMainDoc = await tiktokMainRef.get();

  const tiktokUserData = {
    ...userData,
    accountRef,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };

  if (tiktokMainDoc.exists) {
    delete tiktokUserData.createdAt;
  }

  await tiktokMainRef.set(tiktokUserData, { merge: true });

  const accountData: IAccountData = {
    tiktokMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await accountRef.set(accountData, { merge: true });

  return true;
};
