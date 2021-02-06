import React from "react";

import firebase from "@/firebase/clientApp";
import { TwitterUserCollectionPath } from "@/firebase/firestore";

const PageLimit = 10;

export const useTwitterIndexData = () => {
  const [twitterData, setTwitterData] = React.useState<TwitterUserObjectType[]>([]);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(false);

  const getTwitterPageData = async (getNext = false) => {
    const db = firebase.firestore();
    const twitterCollection = db.collection(TwitterUserCollectionPath);
    let query = twitterCollection.orderBy("public_metrics.followers_count", "desc");

    if (getNext) {
      query = query.startAfter(lastDoc);
    }

    const twitterDocs = await query.limit(PageLimit).get();
    const nextTwitterData: TwitterUserObjectType[] = [];
    twitterDocs.forEach((doc) => {
      const data = doc.data() as TwitterUserObjectType;
      nextTwitterData.push(data);
    });

    if (!getNext) {
      setTwitterData(nextTwitterData);
    } else {
      setTwitterData([...twitterData, ...nextTwitterData]);
    }

    const nextLastDoc = twitterDocs.docs[twitterDocs.docs.length - 1];
    setLastDoc(nextLastDoc);

    if (twitterDocs.docs.length < PageLimit) {
      setHasNext(false);
    } else if (!hasNext) {
      setHasNext(true);
    }
  };

  const getTwitterNextPageData = async () => {
    await getTwitterPageData(true);
  };

  React.useEffect(() => {
    getTwitterPageData();
  }, []);

  return { twitterData, hasNext, getTwitterNextPageData };
};
