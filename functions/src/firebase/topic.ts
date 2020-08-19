import { youtube_v3 } from "googleapis";

export const PopularVideoTopic = "PopularVideoTopic" as const;

export interface PopularVideoJsonType {
  channel: FirebaseFirestore.DocumentData;
  videoCategories: youtube_v3.Schema$VideoCategory[];
}
