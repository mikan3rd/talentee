import React from "react";

import firebase from "../firebase/clientApp";
import { YoutubeChannelCollectionPath } from "../firebase/firestore";

import { IYoutubeData } from "./useIndexData";

const AllOptionValue = "all" as const;

export const VideoCategorieOptions = [
  { text: "すべてのカテゴリ", value: AllOptionValue },
  { text: "映画とアニメ", value: "1" },
  { text: "自動車と乗り物", value: "2" },
  { text: "音楽", value: "10" },
  { text: "ペットと動物", value: "15" },
  { text: "スポーツ", value: "17" },
  { text: "旅行とイベント", value: "19" },
  { text: "ゲーム", value: "20" },
  { text: "ブログ", value: "22" },
  { text: "コメディー", value: "23" },
  { text: "エンターテイメント", value: "24" },
  { text: "ニュースと政治", value: "25" },
  { text: "ハウツーとスタイル", value: "26" },
  { text: "教育", value: "27" },
  { text: "科学と技術", value: "28" },
];

const PageLimit = 10;

export const useYoutubeIndexData = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(VideoCategorieOptions[0].value);
  const [youtubeData, setYoutubeData] = React.useState<IYoutubeData[]>([]);
  const [lastDoc, setLastDoc] = React.useState<firebase.firestore.DocumentData | null>(null);
  const [hasNext, setHasNext] = React.useState(false);

  const getYoutubePageData = async (categoryValue: string, getNext = false) => {
    const db = firebase.firestore();
    const youtubeCollection = db.collection(YoutubeChannelCollectionPath);
    let query = youtubeCollection.orderBy("statistics.subscriberCount", "desc");

    if (categoryValue !== AllOptionValue) {
      query = query.where("videoCategoryIds", "array-contains", categoryValue);
    }

    if (getNext) {
      query = query.startAfter(lastDoc);
    }

    const youtubeDocs = await query.limit(PageLimit).get();
    const nextYoutubeData: IYoutubeData[] = [];
    youtubeDocs.forEach((doc) => {
      const data = doc.data() as IYoutubeData;
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
    await getYoutubePageData(selectedCategory, true);
  };

  const changeSelectedCategory = async (value: string) => {
    await getYoutubePageData(value);
    setSelectedCategory(value);
  };

  React.useEffect(() => {
    getYoutubePageData(selectedCategory);
  }, []);

  return { selectedCategory, youtubeData, hasNext, getYoutubeNextPageData, changeSelectedCategory };
};
