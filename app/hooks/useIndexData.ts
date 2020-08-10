import React from "react";

import firebase from "../firebase/clientApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

interface IYoutubeData {
  id: string;
  snippet: { title: string; description: string; thumbnails: { medium: { url: string } } };
  statistics: { subscriberCount: number };
  accountRef: { id: string };
}

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[] | null>(null);

  const getYoutubePageData = async () => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    const youtubeDocs = await youtubeCollection.orderBy("statistics.subscriberCount", "desc").limit(5).get();
    const youtubeData: IYoutubeData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data() as IYoutubeData;
      youtubeData.push(data);
    });
    setYoutubeData(youtubeData);
  };

  React.useEffect(() => {
    getYoutubePageData();
  }, []);

  return { youtubeData };
};
