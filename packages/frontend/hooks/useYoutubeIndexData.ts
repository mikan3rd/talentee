import React from "react";

import { useRouter } from "next/router";

import { AllOptionValue } from "@/common/youtubeVideoCategory";
import firebase from "@/firebase/clientApp";
import { YoutubeChannelCollectionPath } from "@/firebase/firestore";

const PageLimit = 10;

export const useYoutubeIndexData = (categoryValue: string) => {
  const router = useRouter();
  const [youtubeData, setYoutubeData] = React.useState<YoutubeData[]>([]);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(false);

  const getYoutubePageData = async (categoryValue: string, getNext = false) => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    let query = youtubeCollection.orderBy("statistics.subscriberCount", "desc");

    if (categoryValue !== AllOptionValue) {
      query = query.where("mainVideoCategoryId", "==", categoryValue);
    }

    if (getNext) {
      query = query.startAfter(lastDoc);
    }

    const youtubeDocs = await query.limit(PageLimit).get();
    const nextYoutubeData: YoutubeData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data() as YoutubeData;
      nextYoutubeData.push(data);
    });

    if (!getNext) {
      setYoutubeData(nextYoutubeData);
    } else {
      setYoutubeData([...youtubeData, ...nextYoutubeData]);
    }

    const nextLastDoc = youtubeDocs.docs[youtubeDocs.docs.length - 1];
    setLastDoc(nextLastDoc);

    if (youtubeDocs.docs.length < PageLimit) {
      setHasNext(false);
    } else if (!hasNext) {
      setHasNext(true);
    }
  };

  const getYoutubeNextPageData = async () => {
    await getYoutubePageData(categoryValue, true);
  };

  const changeSelectedCategory = async (value: string) => {
    await router.push(`/youtube/${value}`);
  };

  React.useEffect(() => {
    getYoutubePageData(categoryValue);
  }, [categoryValue]);

  return { youtubeData, hasNext, getYoutubeNextPageData, changeSelectedCategory };
};
