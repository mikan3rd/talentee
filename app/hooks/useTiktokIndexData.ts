import React from "react";

import firebase from "../firebase/clientApp";
import { TiktokUserCollectionPath } from "../firebase/firestore";

const PageLimit = 10;

export const useTiktokIndexData = () => {
  const [tiktokData, setTiktokData] = React.useState<TiktokUserObjectType[]>([]);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(false);

  const getTiktokPageData = async (getNext = false) => {
    const db = firebase.firestore();
    const tiktokCollection = db.collection(TiktokUserCollectionPath);
    let query = tiktokCollection.orderBy("stats.followerCount", "desc");

    if (getNext) {
      query = query.startAfter(lastDoc);
    }

    const tiktokDocs = await query.limit(PageLimit).get();
    const nextTiktokData: TiktokUserObjectType[] = [];
    tiktokDocs.forEach((doc) => {
      const data = doc.data() as TiktokUserObjectType;
      nextTiktokData.push(data);
    });

    if (!getNext) {
      setTiktokData(nextTiktokData);
    } else {
      setTiktokData([...tiktokData, ...nextTiktokData]);
    }

    const nextLastDoc = tiktokDocs.docs[tiktokDocs.docs.length - 1];
    setLastDoc(nextLastDoc);

    if (tiktokDocs.docs.length < PageLimit) {
      setHasNext(false);
    } else if (!hasNext) {
      setHasNext(true);
    }
  };

  const getTiktokNextPageData = async () => {
    await getTiktokPageData(true);
  };

  React.useEffect(() => {
    getTiktokPageData();
  }, []);

  return { tiktokData, hasNext, getTiktokNextPageData };
};
