import React from "react";

import firebase from "../firebase/clientApp";
import { AccountCollectionPath } from "../firebase/firestore";

const PageLimit = 10;

export const useSearchIndex = () => {
  const [accountData, setAccountData] = React.useState<AccountObjectType[]>([]);

  const searchAccount = async (text: string) => {
    const db = firebase.firestore();
    const accountCollection = db.collection(AccountCollectionPath);
    const accountDocs = await accountCollection
      .where("tmpUsername", ">=", text)
      .where("tmpUsername", "<=", text + "\uf8ff")
      .limit(PageLimit)
      .get();

    const nextAccountData: AccountObjectType[] = [];
    accountDocs.forEach((doc) => {
      const data = doc.data() as AccountObjectType;
      nextAccountData.push(data);
    });

    console.log(nextAccountData);
    setAccountData(nextAccountData);
  };

  return { accountData, searchAccount };
};
