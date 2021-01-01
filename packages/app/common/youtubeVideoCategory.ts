export type VideoCategoryOptionType = { text: string; value: string };

export const AllOptionValue = "all" as const;

export const VideoCategorieOptions: VideoCategoryOptionType[] = [
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
