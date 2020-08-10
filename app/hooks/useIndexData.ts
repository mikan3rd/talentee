import React from "react";

import firebase from "../firebase/clientApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

interface IYoutubeData {
  id: string;
  snippet: { title; description };
  statistics: { subscriberCount: number };
}

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<firebase.firestore.DocumentData | null>(null);

  const getYoutubePageData = async () => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    const youtubeDocs = await youtubeCollection.orderBy("statistics.subscriberCount", "desc").limit(5).get();
    const youtubeData: firebase.firestore.DocumentData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data();
      youtubeData.push(data);
    });
    setYoutubeData(youtubeData);
  };

  React.useEffect(() => {
    getYoutubePageData();
  }, []);

  return { youtubeData };
};
