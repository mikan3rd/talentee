import { youtube_v3 } from "googleapis";

export const UpdateAccountTopic = "UpdateAccountTopic" as const;
export const PopularVideoTopic = "PopularVideoTopic" as const;
export const PopularTweetTopic = "PopularTweetTopic" as const;
export const ServiceAccountByYoutubeTopic = "GetServiceAccountByYoutubeTopic" as const;

export type UpdateAccountJsonType = {
  accountId: string;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type PopularVideoJsonType = {
  channelId: string;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type PopularTweetsonType = {
  userId: string;
  username: string;
};

export type ServiceAccountByYoutubeJsonType = {
  channelId: string;
};
