import React from "react";

import firebase from "@/firebase/clientApp";
import { InstagramUserCollectionPath } from "@/firebase/firestore";

const PageLimit = 10;

export const useInstagramIndexData = () => {
  const [instagramData, setTwitterData] = React.useState<InstagramUserObjectType[]>([]);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(false);

  const getInstagramPageData = async (getNext = false) => {
    const db = firebase.firestore();
    const instagramCollection = db.collection(InstagramUserCollectionPath);
    let query = instagramCollection.orderBy("edge_followed_by.count", "desc");

    if (getNext) {
      query = query.startAfter(lastDoc);
    }

    const instagramDocs = await query.limit(PageLimit).get();
    const nextInstagramData: InstagramUserObjectType[] = [];
    instagramDocs.forEach((doc) => {
      const data = doc.data() as InstagramUserObjectType;
      nextInstagramData.push(data);
    });

    if (!getNext) {
      setTwitterData(nextInstagramData);
    } else {
      setTwitterData([...instagramData, ...nextInstagramData]);
    }

    const nextLastDoc = instagramDocs.docs[instagramDocs.docs.length - 1];
    setLastDoc(nextLastDoc);

    if (instagramDocs.docs.length < PageLimit) {
      setHasNext(false);
    } else if (!hasNext) {
      setHasNext(true);
    }
  };

  const getInstagramNextPageData = async () => {
    await getInstagramPageData(true);
  };

  React.useEffect(() => {
    getInstagramPageData();
  }, []);

  return { instagramData, hasNext, getInstagramNextPageData };
};
