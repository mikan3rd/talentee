import { AccountCollectionPath, FieldValue, InstagramUserCollectionPath, db } from "../../firebase/collectionPath";

export const upsertUser = async (accountId: string, userData: InstagramUserType) => {
  const accountCollection = db.collection(AccountCollectionPath);
  const instagramProfileCollection = db.collection(InstagramUserCollectionPath);

  const accountRef = accountCollection.doc(accountId);
  const instagramMainRef = instagramProfileCollection.doc(userData.id);
  const instagramMainDoc = await instagramMainRef.get();

  const instagramProfilerData = {
    ...userData,
    accountRef,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };

  if (instagramMainDoc.exists) {
    delete instagramProfilerData.createdAt;
  }

  await instagramMainRef.set(instagramProfilerData, { merge: true });

  const accountData: IAccountData = {
    instagramMainRef,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await accountRef.set(accountData, { merge: true });
};
