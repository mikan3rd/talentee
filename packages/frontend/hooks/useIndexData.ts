import React from "react";

import firebase from "@/firebase/clientApp";
import {
  InstagramUserCollectionPath,
  TiktokUserCollectionPath,
  TwitterUserCollectionPath,
  YoutubeChannelCollectionPath,
} from "@/firebase/firestore";

export const useIndexData = () => {
  const [youtubeData, setYoutubeData] = React.useState<YoutubeData[]>([]);
  const [twitterData, setTwitterData] = React.useState<TwitterUserObjectType[]>([]);
  const [instagramData, setInstagramData] = React.useState<InstagramUserObjectType[]>([]);
  const [tiktokData, setTiktokData] = React.useState<TiktokUserObjectType[]>([]);

  const getYoutubePageData = async () => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    const youtubeDocs = await youtubeCollection.orderBy("statistics.subscriberCount", "desc").limit(3).get();
    const youtubeData: YoutubeData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data() as YoutubeData;
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

  const getTiktokPageData = async () => {
    const db = firebase.firestore();
    const tiktokCollection = db.collection(TiktokUserCollectionPath);
    const tiktokDocs = await tiktokCollection.orderBy("stats.followerCount", "desc").limit(3).get();
    const tiktokData: TiktokUserObjectType[] = [];
    tiktokDocs.forEach((doc) => {
      const data = doc.data() as TiktokUserObjectType;
      tiktokData.push(data);
    });
    setTiktokData(tiktokData);
  };

  React.useEffect(() => {
    getYoutubePageData();
    getTwitterPageData();
    getInstagramPageData();
    getTiktokPageData();
  }, []);

  return { youtubeData, twitterData, instagramData, tiktokData };
};
