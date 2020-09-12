import React from "react";

import firebase from "../firebase/clientApp";
import {
  InstagramUserCollectionPath,
  TwitterUserCollectionPath,
  YoutubeChannelCollectionPath,
} from "../firebase/firestore";

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[]>([]);
  const [twitterData, setTwitterData] = React.useState<TwitterUserObjectType[]>([]);
  const [instagramData, setInstagramData] = React.useState<InstagramUserObjectType[]>([]);

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

  const getInstagramPageData = async () => {
    const db = firebase.firestore();
    const instagramCollection = db.collection(InstagramUserCollectionPath);
    const instagramDocs = await instagramCollection.orderBy("edge_followed_by.count", "desc").limit(3).get();
    const instagramData: InstagramUserObjectType[] = [];
    instagramDocs.forEach((doc) => {
      const data = doc.data() as InstagramUserObjectType;
      instagramData.push(data);
    });
    setInstagramData(instagramData);
  };

  React.useEffect(() => {
    getYoutubePageData();
    getTwitterPageData();
    getInstagramPageData();
  }, []);

  return { youtubeData, twitterData, instagramData };
};
