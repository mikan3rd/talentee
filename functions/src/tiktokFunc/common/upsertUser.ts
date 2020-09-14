import { AccountCollectionPath, FieldValue, TiktokUserCollectionPath, db } from "../../firebase/collectionPath";

export const upsertUser = async (accountId: string, userData: TiktokUserType) => {
  const accountCollection = db.collection(AccountCollectionPath);
  const tiktokUserCollection = db.collection(TiktokUserCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const tiktokMainRef = tiktokUserCollection.doc(userData.user.id);
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
