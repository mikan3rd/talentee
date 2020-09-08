import { youtube_v3 } from "googleapis";

export const UpdateAccountTopic = "UpdateAccountTopic" as const;
export const UpsertInstagramUserTopic = "UpsertInstagramUserTopic" as const;
export const UpsertTiktokUserTopic = "UpsertTiktokUserTopic" as const;
export const PopularVideoTopic = "PopularVideoTopic" as const;
export const PopularTweetTopic = "PopularTweetTopic" as const;
export const ServiceAccountByYoutubeTopic = "GetServiceAccountByYoutubeTopic" as const;

export type UpdateAccountJsonType = {
  accountId: string;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type UpsertInstagramUserJsonType = {
  accountId: string;
  username: string;
};

export type UpsertTiktokUserJsonType = {
  accountId: string;
  username: string;
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
