import React from "react";

import firebase from "../firebase/clientApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

import { IYoutubeData } from "./useIndexData";

const PageLimit = 10;

export const useYoutubeIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[] | null>(null);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(true);

  const getYoutubePageData = async () => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    let query = youtubeCollection.orderBy("statistics.subscriberCount", "desc");

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const youtubeDocs = await query.limit(PageLimit).get();
    const nextYoutubeData: IYoutubeData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data() as IYoutubeData;
      nextYoutubeData.push(data);
    });

    if (!youtubeData) {
      setYoutubeData(nextYoutubeData);
    } else {
      setYoutubeData([...youtubeData, ...nextYoutubeData]);
    }

    const nextLastDoc = youtubeDocs.docs[youtubeDocs.docs.length - 1];
    setLastDoc(nextLastDoc);

    if (youtubeDocs.docs.length < PageLimit) {
      setHasNext(false);
    }
  };

  React.useEffect(() => {
    getYoutubePageData();
  }, []);

  return { youtubeData, hasNext, getYoutubePageData };
};
