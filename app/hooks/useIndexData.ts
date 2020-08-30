import React from "react";

import firebase from "../firebase/clientApp";
import { TwitterUserCollectionPath, YoutubeChannelCollectionPath } from "../firebase/firestore";

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[]>([]);
  const [twitterData, setTwitterData] = React.useState<TwitterUserObjectType[]>([]);

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

  const getTwitterPageData = async () => {
    const db = firebase.firestore();
    const twitterCollection = db.collection(TwitterUserCollectionPath);
    const twitterDocs = await twitterCollection.orderBy("public_metrics.followers_count", "desc").limit(3).get();
    const twitterData: TwitterUserObjectType[] = [];
    twitterDocs.forEach((doc) => {
      const data = doc.data() as TwitterUserObjectType;
      twitterData.push(data);
    });
    setTwitterData(twitterData);
  };

  React.useEffect(() => {
    getYoutubePageData();
    getTwitterPageData();
  }, []);

  return { youtubeData, twitterData };
};
