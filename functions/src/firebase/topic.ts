import { youtube_v3 } from "googleapis";

export const PopularVideoTopic = "PopularVideoTopic" as const;
export const ServiceAccountByYoutubeTopic = "GetServiceAccountByYoutubeTopic" as const;

export type PopularVideoJsonType = {
  channel: FirebaseFirestore.DocumentData;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type ServiceAccountByYoutubeJsonType = {
  channelId: string;
};
