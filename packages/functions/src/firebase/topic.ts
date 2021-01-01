import { youtube_v3 } from "googleapis";

export const Topic = {
  UpdateAccount: "UpdateAccount" as const,
  UpsertYoutubeChannel: "UpsertYoutubeChannel" as const,
  UpsertTwitterUser: "UpsertTwitterUser" as const,
  UpsertInstagramUser: "UpsertInstagramUser" as const,
  UpsertTiktokUser: "UpsertTiktokUser" as const,
  PopularVideo: "PopularVideo" as const,
  PopularTweet: "PopularTweet" as const,
  ServiceAccount: "ServiceAccount" as const,
};

export type UpdateAccountJsonType = {
  accountId: string;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type UpsertYoutubeChannelJsonType = {
  accountId: string;
  channelId: string;
};

export type UpsertTwitterUserJsonType = {
  accountId: string;
  username: string;
};

export type UpsertInstagramUserJsonType = {
  accountId: string;
  username: string;
};

export type UpsertTiktokUserJsonType = {
  accountId: string;
  uniqueId: string;
};

export type PopularVideoJsonType = {
  channelId: string;
  videoCategories: youtube_v3.Schema$VideoCategory[];
};

export type PopularTweetsonType = {
  userId: string;
  username: string;
};

export type ServiceAccountJsonType = {
  accountId: string;
};
