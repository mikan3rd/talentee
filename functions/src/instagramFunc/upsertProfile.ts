import { AccountCollectionPath, FieldValue, InstagramProfileCollectionPath, db } from "../firebase/collectionPath";

import { getUserData } from "./common/getUserData";

export const upsertProfile = async (accountId: string, username: string) => {
  const userData = await getUserData(username);

  const { id } = userData;
  if (!id) {
    console.error(`NOT FOUND: accountId: ${accountId}, username: ${username}`);
    return false;
  }

  const accountCollection = db.collection(AccountCollectionPath);
  const instagramProfileCollection = db.collection(InstagramProfileCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const instagramMainRef = instagramProfileCollection.doc(id);

  const instagramProfilerData = {
    ...userData,
    accountRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await instagramMainRef.set(instagramProfilerData, { merge: true });

  const accountData: IAccountData = {
    instagramMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await accountRef.set(accountData, { merge: true });

  return true;
};
