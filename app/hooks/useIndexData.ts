import React from "react";

import firebase from "../firebase/clientApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[] | null>(null);

  const getYoutubePageData = async () => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    const youtubeDocs = await youtubeCollection.orderBy("statistics.subscriberCount", "desc").limit(3).get();
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
