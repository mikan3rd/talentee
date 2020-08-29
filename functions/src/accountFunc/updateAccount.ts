import * as admin from "firebase-admin";

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

  if (youtubeMainRef) {
    //
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
