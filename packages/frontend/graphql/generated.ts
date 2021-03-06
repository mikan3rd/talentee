import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** BigInt custom scalar type */
  BigInt: number;
  /** Date custom scalar type */
  Date: number;
};

export type Account = {
  uuid: Scalars["ID"];
  displayName: Scalars["String"];
  username: Scalars["String"];
  thumbnailUrl: Scalars["String"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  youtubeChannels: Array<YoutubeChannel>;
  twitterUsers: Array<TwitterUser>;
  instagramUsers: Array<InstagramUser>;
  tiktokUsers: Array<TiktokUser>;
};

export type AccountEditInput = {
  uuid: Scalars["ID"];
  displayName: Scalars["String"];
};

export type AccountSearchByUsernameInput = {
  youtubeChannelId?: Maybe<Scalars["String"]>;
  twitterUsername?: Maybe<Scalars["String"]>;
  instagramUsername?: Maybe<Scalars["String"]>;
  tiktokUniqueId?: Maybe<Scalars["String"]>;
};

export type AccountSearchInput = {
  take: Scalars["Int"];
  word: Scalars["String"];
};

export type AccountSearchPaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  word: Scalars["String"];
};

export type AccountSearchResult = {
  totalPages: Scalars["Int"];
  accounts: Array<Account>;
  totalCount: Scalars["Int"];
};

export type InstagramLocation = {
  id: Scalars["ID"];
  name: Scalars["String"];
  slug: Scalars["String"];
  hasPublicPage: Scalars["Boolean"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  mediaList: Array<InstagramMedia>;
};

export type InstagramMedia = {
  id: Scalars["ID"];
  shortcode: Scalars["String"];
  thumbnailSrc: Scalars["String"];
  mediaToCaption: Scalars["String"];
  displayUrl: Scalars["String"];
  likedBy: Scalars["BigInt"];
  mediaPreviewLike: Scalars["BigInt"];
  mediaToComment: Scalars["BigInt"];
  videoViewCount?: Maybe<Scalars["BigInt"]>;
  productType?: Maybe<Scalars["String"]>;
  isVideo: Scalars["Boolean"];
  takenAtTimestamp: Scalars["Date"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  user: InstagramUser;
  location?: Maybe<InstagramLocation>;
};

export type InstagramRankingPage = {
  totalPages: Scalars["Int"];
  instagramUsers: Array<InstagramUser>;
};

export type InstagramUser = {
  id: Scalars["ID"];
  fullName: Scalars["String"];
  username: Scalars["String"];
  biography: Scalars["String"];
  externalUrl?: Maybe<Scalars["String"]>;
  profilePicUrl: Scalars["String"];
  followedBy: Scalars["BigInt"];
  follow: Scalars["BigInt"];
  isVerified: Scalars["Boolean"];
  isPrivate: Scalars["Boolean"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  accountId: Scalars["String"];
  account: Account;
  mediaList: Array<InstagramMedia>;
};

export type Mutation = {
  addAccountByUsername: Account;
  updateAccount: Account;
};

export type MutationAddAccountByUsernameArgs = {
  username: AccountSearchByUsernameInput;
};

export type MutationUpdateAccountArgs = {
  account: AccountEditInput;
};

export type PaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
};

export type Query = {
  getAccountPage?: Maybe<Account>;
  getTopPage: TopPage;
  searchAccountByName: AccountSearchResult;
  getSitemapData: Sitemap;
  getYoutubeCategoryRankingPage: YoutubeRankingPage;
  getYoutubeKeywordRankingPage: YoutubeKeywordRankingPage;
  getYoutubeVideoTagRankingPage: YoutubeVideoTagRankingPage;
  getYoutubeKeywordIndexPage: YoutubeKeywordIndexPage;
  getYoutubeVideoTagIndexPage: YoutubeVideoTagIndexPage;
  searchYoutubeKeywordByWord: YoutubeKeywordSearchResult;
  getTwitterRankingPage: TwitterRankingPage;
  getInstagramRankingPage: InstagramRankingPage;
  getTiktokRankingPage: TiktokRankingPage;
  getCurrentUser: User;
  findAccountByUsername?: Maybe<Account>;
  searchAccount: Array<Account>;
};

export type QueryGetAccountPageArgs = {
  uuid: Scalars["ID"];
};

export type QuerySearchAccountByNameArgs = {
  pagination: AccountSearchPaginationInput;
};

export type QueryGetYoutubeCategoryRankingPageArgs = {
  pagination: YoutubeCategoryPaginationInput;
};

export type QueryGetYoutubeKeywordRankingPageArgs = {
  pagination: YoutubeKeywordPaginationInput;
};

export type QueryGetYoutubeVideoTagRankingPageArgs = {
  pagination: YoutubeVideoTagPaginationInput;
};

export type QueryGetYoutubeKeywordIndexPageArgs = {
  pagination: PaginationInput;
};

export type QueryGetYoutubeVideoTagIndexPageArgs = {
  pagination: PaginationInput;
};

export type QuerySearchYoutubeKeywordByWordArgs = {
  input: YoutubeKeywordSearchInput;
};

export type QueryGetTwitterRankingPageArgs = {
  pagination: PaginationInput;
};

export type QueryGetInstagramRankingPageArgs = {
  pagination: PaginationInput;
};

export type QueryGetTiktokRankingPageArgs = {
  pagination: PaginationInput;
};

export type QueryFindAccountByUsernameArgs = {
  username: AccountSearchByUsernameInput;
};

export type QuerySearchAccountArgs = {
  pagination: AccountSearchInput;
};

export type Sitemap = {
  accounts: Array<Account>;
  youtubeVideoCategories: Array<YoutubeVideoCategory>;
  youtubeKeywords: Array<YoutubeKeyword>;
  youtubeTags: Array<YoutubeTag>;
};

export type TiktokItem = {
  id: Scalars["ID"];
  desc: Scalars["String"];
  commentCount: Scalars["BigInt"];
  diggCount: Scalars["BigInt"];
  playCount: Scalars["BigInt"];
  shareCount: Scalars["BigInt"];
  createdTimestamp: Scalars["Date"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  user: TiktokUser;
};

export type TiktokRankingPage = {
  totalPages: Scalars["Int"];
  tiktokUsers: Array<TiktokUser>;
};

export type TiktokUser = {
  id: Scalars["ID"];
  nickname: Scalars["String"];
  uniqueId: Scalars["String"];
  signature: Scalars["String"];
  bioLink?: Maybe<Scalars["String"]>;
  avatarThumb: Scalars["String"];
  followerCount: Scalars["BigInt"];
  followingCount: Scalars["BigInt"];
  heartCount: Scalars["BigInt"];
  videoCount: Scalars["BigInt"];
  verified: Scalars["Boolean"];
  privateAccount: Scalars["Boolean"];
  secret: Scalars["Boolean"];
  createdTimestamp: Scalars["Date"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  accountId: Scalars["String"];
  account: Account;
  items: Array<TiktokItem>;
};

export type TopPage = {
  youtubeChannels: Array<YoutubeChannel>;
  twitterUsers: Array<TwitterUser>;
  instagramUsers: Array<InstagramUser>;
  tiktokUsers: Array<TiktokUser>;
};

export type TwitterRankingPage = {
  totalPages: Scalars["Int"];
  twitterUsers: Array<TwitterUser>;
};

export type TwitterTweet = {
  id: Scalars["ID"];
  text: Scalars["String"];
  retweetCount: Scalars["BigInt"];
  replyCount: Scalars["BigInt"];
  likeCount: Scalars["BigInt"];
  quoteCount: Scalars["BigInt"];
  possiblySensitive: Scalars["Boolean"];
  tweetType?: Maybe<Scalars["String"]>;
  createdTimestamp: Scalars["Date"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  user: TwitterUser;
};

export type TwitterUser = {
  id: Scalars["ID"];
  name: Scalars["String"];
  username: Scalars["String"];
  description: Scalars["String"];
  profileImageUrl: Scalars["String"];
  followersCount: Scalars["BigInt"];
  followingCount: Scalars["BigInt"];
  listedCount: Scalars["BigInt"];
  tweetCount: Scalars["BigInt"];
  verified: Scalars["Boolean"];
  protected: Scalars["Boolean"];
  createdTimestamp: Scalars["Date"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  accountId: Scalars["String"];
  account: Account;
  tweets: Array<TwitterTweet>;
};

export type User = {
  uid: Scalars["ID"];
  name: Scalars["String"];
  email: Scalars["String"];
  role: UserRole;
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
};

export enum UserRole {
  None = "NONE",
  Admin = "ADMIN",
}

export type YoutubeCategoryPaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  videoCategoryId?: Maybe<Scalars["Int"]>;
  isAll: Scalars["Boolean"];
};

export type YoutubeChannel = {
  id: Scalars["ID"];
  title: Scalars["String"];
  description: Scalars["String"];
  thumbnailUrl: Scalars["String"];
  country?: Maybe<Scalars["String"]>;
  publishedAt: Scalars["Date"];
  subscriberCount?: Maybe<Scalars["BigInt"]>;
  viewCount: Scalars["BigInt"];
  videoCount: Scalars["BigInt"];
  hiddenSubscriberCount: Scalars["Boolean"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  accountId: Scalars["String"];
  mainVideoCategoryId?: Maybe<Scalars["Int"]>;
  keywords: Array<YoutubeChannelKeywordRelation>;
  videos: Array<YoutubeVideo>;
  account: Account;
  channelVideoCategories: Array<YoutubeChannelVideoCategory>;
};

export type YoutubeChannelKeywordRelation = {
  channelId: Scalars["ID"];
  keywordId: Scalars["ID"];
  channel: YoutubeChannel;
  keyword: YoutubeKeyword;
};

export type YoutubeChannelVideoCategory = {
  channelId: Scalars["ID"];
  videoCategoryId: Scalars["Float"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  channel: YoutubeChannel;
  videoCategory: YoutubeVideoCategory;
};

export type YoutubeKeyword = {
  id: Scalars["Float"];
  title: Scalars["String"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  channels: Array<YoutubeChannel>;
};

export type YoutubeKeywordIndexPage = {
  totalPages: Scalars["Int"];
  youtubeKeywords: Array<YoutubeKeyword>;
};

export type YoutubeKeywordPaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  keywordTitle?: Maybe<Scalars["String"]>;
  keywordId?: Maybe<Scalars["Int"]>;
};

export type YoutubeKeywordRankingPage = {
  totalPages: Scalars["Int"];
  youtubeChannels: Array<YoutubeChannel>;
  youtubeKeyword?: Maybe<YoutubeKeyword>;
};

export type YoutubeKeywordSearchInput = {
  take: Scalars["Int"];
  word: Scalars["String"];
};

export type YoutubeKeywordSearchResult = {
  youtubeKeywords: Array<YoutubeKeyword>;
  youtubeTags: Array<YoutubeTag>;
};

export type YoutubeRankingPage = {
  totalPages: Scalars["Int"];
  youtubeChannels: Array<YoutubeChannel>;
  youtubeVideoCategories: Array<YoutubeVideoCategory>;
};

export type YoutubeTag = {
  id: Scalars["Float"];
  title: Scalars["String"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  videos: Array<YoutubeVideo>;
};

export type YoutubeVideo = {
  id: Scalars["String"];
  title: Scalars["String"];
  description: Scalars["String"];
  thumbnailUrl: Scalars["String"];
  publishedAt: Scalars["Date"];
  viewCount?: Maybe<Scalars["BigInt"]>;
  likeCount?: Maybe<Scalars["BigInt"]>;
  dislikeCount?: Maybe<Scalars["BigInt"]>;
  commentCount?: Maybe<Scalars["BigInt"]>;
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  tags: Array<YoutubeVideoTagRelation>;
  videoCategory: YoutubeVideoCategory;
  channel: YoutubeChannel;
};

export type YoutubeVideoCategory = {
  id: Scalars["Float"];
  title: Scalars["String"];
  assignable: Scalars["Boolean"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  videos: Array<YoutubeVideo>;
  channelVideoCategories: Array<YoutubeChannelVideoCategory>;
};

export type YoutubeVideoTagIndexPage = {
  totalPages: Scalars["Int"];
  youtubeTags: Array<YoutubeTag>;
};

export type YoutubeVideoTagPaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  tagId: Scalars["Int"];
};

export type YoutubeVideoTagRankingPage = {
  totalPages: Scalars["Int"];
  youtubeChannels: Array<YoutubeChannel>;
  youtubeTag?: Maybe<YoutubeTag>;
};

export type YoutubeVideoTagRelation = {
  videoId: Scalars["ID"];
  tagOd: Scalars["ID"];
  video: YoutubeVideo;
  tag: YoutubeTag;
};

export type AddAccountByUsernameMutationVariables = Exact<{
  username: AccountSearchByUsernameInput;
}>;

export type AddAccountByUsernameMutation = {
  addAccountByUsername: Pick<Account, "uuid" | "displayName" | "thumbnailUrl"> & {
    youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
    twitterUsers: Array<Pick<TwitterUser, "username">>;
    instagramUsers: Array<Pick<InstagramUser, "username">>;
    tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
  };
};

export type UpdateAccountMutationVariables = Exact<{
  account: AccountEditInput;
}>;

export type UpdateAccountMutation = { updateAccount: Pick<Account, "uuid" | "displayName"> };

export type FindAccountByUsernameQueryVariables = Exact<{
  username: AccountSearchByUsernameInput;
}>;

export type FindAccountByUsernameQuery = {
  findAccountByUsername?: Maybe<
    Pick<Account, "uuid" | "displayName" | "thumbnailUrl"> & {
      youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
      twitterUsers: Array<Pick<TwitterUser, "username">>;
      instagramUsers: Array<Pick<InstagramUser, "username">>;
      tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
    }
  >;
};

export type GetAccountPageQueryVariables = Exact<{
  uuid: Scalars["ID"];
}>;

export type GetAccountPageQuery = {
  getAccountPage?: Maybe<
    Pick<Account, "uuid" | "displayName" | "thumbnailUrl" | "username" | "updatedAt"> & {
      youtubeChannels: Array<
        Pick<
          YoutubeChannel,
          | "id"
          | "title"
          | "description"
          | "thumbnailUrl"
          | "hiddenSubscriberCount"
          | "subscriberCount"
          | "viewCount"
          | "videoCount"
          | "publishedAt"
          | "accountId"
          | "mainVideoCategoryId"
        > & {
          videos: Array<
            Pick<YoutubeVideo, "id" | "title" | "publishedAt" | "viewCount" | "likeCount" | "dislikeCount"> & {
              tags: Array<{ tag: Pick<YoutubeTag, "id" | "title"> }>;
            }
          >;
          keywords: Array<{ keyword: Pick<YoutubeKeyword, "id" | "title"> }>;
          channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }>;
        }
      >;
      twitterUsers: Array<
        Pick<
          TwitterUser,
          | "name"
          | "username"
          | "profileImageUrl"
          | "description"
          | "followersCount"
          | "followingCount"
          | "tweetCount"
          | "createdTimestamp"
        > & { tweets: Array<Pick<TwitterTweet, "id">> }
      >;
      instagramUsers: Array<
        Pick<
          InstagramUser,
          "username" | "fullName" | "biography" | "externalUrl" | "profilePicUrl" | "follow" | "followedBy"
        > & { mediaList: Array<Pick<InstagramMedia, "shortcode">> }
      >;
      tiktokUsers: Array<
        Pick<
          TiktokUser,
          | "uniqueId"
          | "nickname"
          | "signature"
          | "avatarThumb"
          | "followerCount"
          | "followingCount"
          | "heartCount"
          | "videoCount"
        > & { items: Array<Pick<TiktokItem, "id">> }
      >;
    }
  >;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  getCurrentUser: Pick<User, "uid" | "name" | "email" | "role" | "createdAt" | "updatedAt">;
};

export type GetInstagramRankingPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetInstagramRankingPageQuery = {
  getInstagramRankingPage: Pick<InstagramRankingPage, "totalPages"> & {
    instagramUsers: Array<
      Pick<InstagramUser, "username" | "fullName" | "biography" | "profilePicUrl" | "followedBy" | "accountId"> & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type GetSitemapDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetSitemapDataQuery = {
  getSitemapData: {
    accounts: Array<Pick<Account, "uuid" | "updatedAt">>;
    youtubeVideoCategories: Array<Pick<YoutubeVideoCategory, "id">>;
    youtubeKeywords: Array<Pick<YoutubeKeyword, "id">>;
    youtubeTags: Array<Pick<YoutubeTag, "id">>;
  };
};

export type GetTiktokRankingPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetTiktokRankingPageQuery = {
  getTiktokRankingPage: Pick<TiktokRankingPage, "totalPages"> & {
    tiktokUsers: Array<
      Pick<
        TiktokUser,
        | "uniqueId"
        | "nickname"
        | "signature"
        | "avatarThumb"
        | "followerCount"
        | "heartCount"
        | "videoCount"
        | "accountId"
      > & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type GetTopPageQueryVariables = Exact<{ [key: string]: never }>;

export type GetTopPageQuery = {
  getTopPage: {
    youtubeChannels: Array<
      Pick<
        YoutubeChannel,
        | "id"
        | "title"
        | "thumbnailUrl"
        | "description"
        | "subscriberCount"
        | "viewCount"
        | "videoCount"
        | "hiddenSubscriberCount"
        | "accountId"
        | "mainVideoCategoryId"
      > & {
        keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
        channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }>;
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
    twitterUsers: Array<
      Pick<
        TwitterUser,
        "username" | "name" | "description" | "followersCount" | "tweetCount" | "profileImageUrl" | "accountId"
      > & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
    instagramUsers: Array<
      Pick<InstagramUser, "username" | "fullName" | "biography" | "profilePicUrl" | "followedBy" | "accountId"> & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
    tiktokUsers: Array<
      Pick<
        TiktokUser,
        | "uniqueId"
        | "nickname"
        | "signature"
        | "avatarThumb"
        | "followerCount"
        | "heartCount"
        | "videoCount"
        | "accountId"
      > & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type GetTwitterRankingPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetTwitterRankingPageQuery = {
  getTwitterRankingPage: Pick<TwitterRankingPage, "totalPages"> & {
    twitterUsers: Array<
      Pick<
        TwitterUser,
        "username" | "name" | "description" | "followersCount" | "tweetCount" | "profileImageUrl" | "accountId"
      > & {
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type GetYoutubeCategoryRankingPageQueryVariables = Exact<{
  pagination: YoutubeCategoryPaginationInput;
}>;

export type GetYoutubeCategoryRankingPageQuery = {
  getYoutubeCategoryRankingPage: Pick<YoutubeRankingPage, "totalPages"> & {
    youtubeChannels: Array<
      Pick<
        YoutubeChannel,
        | "id"
        | "title"
        | "thumbnailUrl"
        | "description"
        | "subscriberCount"
        | "viewCount"
        | "videoCount"
        | "hiddenSubscriberCount"
        | "accountId"
        | "mainVideoCategoryId"
      > & {
        keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
        channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }>;
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
    youtubeVideoCategories: Array<Pick<YoutubeVideoCategory, "id" | "title">>;
  };
};

export type GetYoutubeKeywordIndexPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetYoutubeKeywordIndexPageQuery = {
  getYoutubeKeywordIndexPage: Pick<YoutubeKeywordIndexPage, "totalPages"> & {
    youtubeKeywords: Array<Pick<YoutubeKeyword, "id" | "title">>;
  };
};

export type GetYoutubeKeywordRankingPageQueryVariables = Exact<{
  pagination: YoutubeKeywordPaginationInput;
}>;

export type GetYoutubeKeywordRankingPageQuery = {
  getYoutubeKeywordRankingPage: Pick<YoutubeKeywordRankingPage, "totalPages"> & {
    youtubeKeyword?: Maybe<Pick<YoutubeKeyword, "id" | "title">>;
    youtubeChannels: Array<
      Pick<
        YoutubeChannel,
        | "id"
        | "title"
        | "thumbnailUrl"
        | "description"
        | "subscriberCount"
        | "viewCount"
        | "videoCount"
        | "hiddenSubscriberCount"
        | "accountId"
        | "mainVideoCategoryId"
      > & {
        keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
        channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }>;
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type GetYoutubeVideoTagIndexPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetYoutubeVideoTagIndexPageQuery = {
  getYoutubeVideoTagIndexPage: Pick<YoutubeVideoTagIndexPage, "totalPages"> & {
    youtubeTags: Array<Pick<YoutubeTag, "id" | "title">>;
  };
};

export type GetYoutubeVideoTagRankingPageQueryVariables = Exact<{
  pagination: YoutubeVideoTagPaginationInput;
}>;

export type GetYoutubeVideoTagRankingPageQuery = {
  getYoutubeVideoTagRankingPage: Pick<YoutubeVideoTagRankingPage, "totalPages"> & {
    youtubeTag?: Maybe<Pick<YoutubeTag, "id" | "title">>;
    youtubeChannels: Array<
      Pick<
        YoutubeChannel,
        | "id"
        | "title"
        | "thumbnailUrl"
        | "description"
        | "subscriberCount"
        | "viewCount"
        | "videoCount"
        | "hiddenSubscriberCount"
        | "accountId"
        | "mainVideoCategoryId"
      > & {
        keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
        channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }>;
        account: {
          youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
          twitterUsers: Array<Pick<TwitterUser, "username">>;
          instagramUsers: Array<Pick<InstagramUser, "username">>;
          tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
        };
      }
    >;
  };
};

export type SearchAccountQueryVariables = Exact<{
  pagination: AccountSearchInput;
}>;

export type SearchAccountQuery = {
  searchAccount: Array<
    Pick<Account, "uuid" | "displayName" | "thumbnailUrl"> & {
      youtubeChannels: Array<Pick<YoutubeChannel, "id" | "title">>;
      twitterUsers: Array<Pick<TwitterUser, "username" | "name">>;
      instagramUsers: Array<Pick<InstagramUser, "username" | "fullName">>;
      tiktokUsers: Array<Pick<TiktokUser, "uniqueId" | "nickname">>;
    }
  >;
};

export type SearchAccountByNameQueryVariables = Exact<{
  pagination: AccountSearchPaginationInput;
}>;

export type SearchAccountByNameQuery = {
  searchAccountByName: Pick<AccountSearchResult, "totalCount" | "totalPages"> & {
    accounts: Array<
      Pick<Account, "uuid" | "displayName" | "thumbnailUrl"> & {
        youtubeChannels: Array<Pick<YoutubeChannel, "id">>;
        twitterUsers: Array<Pick<TwitterUser, "username">>;
        instagramUsers: Array<Pick<InstagramUser, "username">>;
        tiktokUsers: Array<Pick<TiktokUser, "uniqueId">>;
      }
    >;
  };
};

export type SearchYoutubeKeywordByWordQueryVariables = Exact<{
  input: YoutubeKeywordSearchInput;
}>;

export type SearchYoutubeKeywordByWordQuery = {
  searchYoutubeKeywordByWord: {
    youtubeKeywords: Array<Pick<YoutubeKeyword, "id" | "title">>;
    youtubeTags: Array<Pick<YoutubeTag, "id" | "title">>;
  };
};

export const AddAccountByUsernameDocument = gql`
  mutation addAccountByUsername($username: AccountSearchByUsernameInput!) {
    addAccountByUsername(username: $username) {
      uuid
      displayName
      thumbnailUrl
      youtubeChannels {
        id
      }
      twitterUsers {
        username
      }
      instagramUsers {
        username
      }
      tiktokUsers {
        uniqueId
      }
    }
  }
`;
export type AddAccountByUsernameMutationFn = Apollo.MutationFunction<
  AddAccountByUsernameMutation,
  AddAccountByUsernameMutationVariables
>;

/**
 * __useAddAccountByUsernameMutation__
 *
 * To run a mutation, you first call `useAddAccountByUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAccountByUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAccountByUsernameMutation, { data, loading, error }] = useAddAccountByUsernameMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useAddAccountByUsernameMutation(
  baseOptions?: Apollo.MutationHookOptions<AddAccountByUsernameMutation, AddAccountByUsernameMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddAccountByUsernameMutation, AddAccountByUsernameMutationVariables>(
    AddAccountByUsernameDocument,
    options,
  );
}
export type AddAccountByUsernameMutationHookResult = ReturnType<typeof useAddAccountByUsernameMutation>;
export type AddAccountByUsernameMutationResult = Apollo.MutationResult<AddAccountByUsernameMutation>;
export type AddAccountByUsernameMutationOptions = Apollo.BaseMutationOptions<
  AddAccountByUsernameMutation,
  AddAccountByUsernameMutationVariables
>;
export const UpdateAccountDocument = gql`
  mutation updateAccount($account: AccountEditInput!) {
    updateAccount(account: $account) {
      uuid
      displayName
    }
  }
`;
export type UpdateAccountMutationFn = Apollo.MutationFunction<UpdateAccountMutation, UpdateAccountMutationVariables>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useUpdateAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateAccountMutation, UpdateAccountMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, options);
}
export type UpdateAccountMutationHookResult = ReturnType<typeof useUpdateAccountMutation>;
export type UpdateAccountMutationResult = Apollo.MutationResult<UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<
  UpdateAccountMutation,
  UpdateAccountMutationVariables
>;
export const FindAccountByUsernameDocument = gql`
  query findAccountByUsername($username: AccountSearchByUsernameInput!) {
    findAccountByUsername(username: $username) {
      uuid
      displayName
      thumbnailUrl
      youtubeChannels {
        id
      }
      twitterUsers {
        username
      }
      instagramUsers {
        username
      }
      tiktokUsers {
        uniqueId
      }
    }
  }
`;

/**
 * __useFindAccountByUsernameQuery__
 *
 * To run a query within a React component, call `useFindAccountByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAccountByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAccountByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFindAccountByUsernameQuery(
  baseOptions: Apollo.QueryHookOptions<FindAccountByUsernameQuery, FindAccountByUsernameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FindAccountByUsernameQuery, FindAccountByUsernameQueryVariables>(
    FindAccountByUsernameDocument,
    options,
  );
}
export function useFindAccountByUsernameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FindAccountByUsernameQuery, FindAccountByUsernameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FindAccountByUsernameQuery, FindAccountByUsernameQueryVariables>(
    FindAccountByUsernameDocument,
    options,
  );
}
export type FindAccountByUsernameQueryHookResult = ReturnType<typeof useFindAccountByUsernameQuery>;
export type FindAccountByUsernameLazyQueryHookResult = ReturnType<typeof useFindAccountByUsernameLazyQuery>;
export type FindAccountByUsernameQueryResult = Apollo.QueryResult<
  FindAccountByUsernameQuery,
  FindAccountByUsernameQueryVariables
>;
export const GetAccountPageDocument = gql`
  query getAccountPage($uuid: ID!) {
    getAccountPage(uuid: $uuid) {
      uuid
      displayName
      thumbnailUrl
      username
      updatedAt
      youtubeChannels {
        id
        title
        description
        thumbnailUrl
        hiddenSubscriberCount
        subscriberCount
        viewCount
        videoCount
        publishedAt
        accountId
        mainVideoCategoryId
        videos {
          id
          title
          publishedAt
          viewCount
          likeCount
          dislikeCount
          tags {
            tag {
              id
              title
            }
          }
        }
        keywords {
          keyword {
            id
            title
          }
        }
        channelVideoCategories {
          videoCategory {
            id
            title
          }
        }
      }
      twitterUsers {
        name
        username
        profileImageUrl
        description
        followersCount
        followingCount
        tweetCount
        createdTimestamp
        tweets {
          id
        }
      }
      instagramUsers {
        username
        fullName
        biography
        externalUrl
        profilePicUrl
        follow
        followedBy
        mediaList {
          shortcode
        }
      }
      tiktokUsers {
        uniqueId
        nickname
        signature
        avatarThumb
        followerCount
        followingCount
        heartCount
        videoCount
        items {
          id
        }
      }
    }
  }
`;

/**
 * __useGetAccountPageQuery__
 *
 * To run a query within a React component, call `useGetAccountPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountPageQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useGetAccountPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetAccountPageQuery, GetAccountPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAccountPageQuery, GetAccountPageQueryVariables>(GetAccountPageDocument, options);
}
export function useGetAccountPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAccountPageQuery, GetAccountPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAccountPageQuery, GetAccountPageQueryVariables>(GetAccountPageDocument, options);
}
export type GetAccountPageQueryHookResult = ReturnType<typeof useGetAccountPageQuery>;
export type GetAccountPageLazyQueryHookResult = ReturnType<typeof useGetAccountPageLazyQuery>;
export type GetAccountPageQueryResult = Apollo.QueryResult<GetAccountPageQuery, GetAccountPageQueryVariables>;
export const GetCurrentUserDocument = gql`
  query getCurrentUser {
    getCurrentUser {
      uid
      name
      email
      role
      createdAt
      updatedAt
    }
  }
`;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}
export function useGetCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetInstagramRankingPageDocument = gql`
  query getInstagramRankingPage($pagination: PaginationInput!) {
    getInstagramRankingPage(pagination: $pagination) {
      totalPages
      instagramUsers {
        username
        fullName
        biography
        profilePicUrl
        followedBy
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetInstagramRankingPageQuery__
 *
 * To run a query within a React component, call `useGetInstagramRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstagramRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstagramRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetInstagramRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>(
    GetInstagramRankingPageDocument,
    options,
  );
}
export function useGetInstagramRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>(
    GetInstagramRankingPageDocument,
    options,
  );
}
export type GetInstagramRankingPageQueryHookResult = ReturnType<typeof useGetInstagramRankingPageQuery>;
export type GetInstagramRankingPageLazyQueryHookResult = ReturnType<typeof useGetInstagramRankingPageLazyQuery>;
export type GetInstagramRankingPageQueryResult = Apollo.QueryResult<
  GetInstagramRankingPageQuery,
  GetInstagramRankingPageQueryVariables
>;
export const GetSitemapDataDocument = gql`
  query getSitemapData {
    getSitemapData {
      accounts {
        uuid
        updatedAt
      }
      youtubeVideoCategories {
        id
      }
      youtubeKeywords {
        id
      }
      youtubeTags {
        id
      }
    }
  }
`;

/**
 * __useGetSitemapDataQuery__
 *
 * To run a query within a React component, call `useGetSitemapDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSitemapDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSitemapDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSitemapDataQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSitemapDataQuery, GetSitemapDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSitemapDataQuery, GetSitemapDataQueryVariables>(GetSitemapDataDocument, options);
}
export function useGetSitemapDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSitemapDataQuery, GetSitemapDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSitemapDataQuery, GetSitemapDataQueryVariables>(GetSitemapDataDocument, options);
}
export type GetSitemapDataQueryHookResult = ReturnType<typeof useGetSitemapDataQuery>;
export type GetSitemapDataLazyQueryHookResult = ReturnType<typeof useGetSitemapDataLazyQuery>;
export type GetSitemapDataQueryResult = Apollo.QueryResult<GetSitemapDataQuery, GetSitemapDataQueryVariables>;
export const GetTiktokRankingPageDocument = gql`
  query getTiktokRankingPage($pagination: PaginationInput!) {
    getTiktokRankingPage(pagination: $pagination) {
      totalPages
      tiktokUsers {
        uniqueId
        nickname
        signature
        avatarThumb
        followerCount
        heartCount
        videoCount
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetTiktokRankingPageQuery__
 *
 * To run a query within a React component, call `useGetTiktokRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTiktokRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTiktokRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetTiktokRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>(
    GetTiktokRankingPageDocument,
    options,
  );
}
export function useGetTiktokRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>(
    GetTiktokRankingPageDocument,
    options,
  );
}
export type GetTiktokRankingPageQueryHookResult = ReturnType<typeof useGetTiktokRankingPageQuery>;
export type GetTiktokRankingPageLazyQueryHookResult = ReturnType<typeof useGetTiktokRankingPageLazyQuery>;
export type GetTiktokRankingPageQueryResult = Apollo.QueryResult<
  GetTiktokRankingPageQuery,
  GetTiktokRankingPageQueryVariables
>;
export const GetTopPageDocument = gql`
  query getTopPage {
    getTopPage {
      youtubeChannels {
        id
        title
        thumbnailUrl
        description
        subscriberCount
        viewCount
        videoCount
        hiddenSubscriberCount
        accountId
        mainVideoCategoryId
        keywords {
          keyword {
            title
          }
        }
        channelVideoCategories {
          videoCategory {
            id
            title
          }
        }
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
      twitterUsers {
        username
        name
        description
        followersCount
        tweetCount
        profileImageUrl
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
      instagramUsers {
        username
        fullName
        biography
        profilePicUrl
        followedBy
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
      tiktokUsers {
        uniqueId
        nickname
        signature
        avatarThumb
        followerCount
        heartCount
        videoCount
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetTopPageQuery__
 *
 * To run a query within a React component, call `useGetTopPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTopPageQuery(baseOptions?: Apollo.QueryHookOptions<GetTopPageQuery, GetTopPageQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTopPageQuery, GetTopPageQueryVariables>(GetTopPageDocument, options);
}
export function useGetTopPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTopPageQuery, GetTopPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTopPageQuery, GetTopPageQueryVariables>(GetTopPageDocument, options);
}
export type GetTopPageQueryHookResult = ReturnType<typeof useGetTopPageQuery>;
export type GetTopPageLazyQueryHookResult = ReturnType<typeof useGetTopPageLazyQuery>;
export type GetTopPageQueryResult = Apollo.QueryResult<GetTopPageQuery, GetTopPageQueryVariables>;
export const GetTwitterRankingPageDocument = gql`
  query getTwitterRankingPage($pagination: PaginationInput!) {
    getTwitterRankingPage(pagination: $pagination) {
      totalPages
      twitterUsers {
        username
        name
        description
        followersCount
        tweetCount
        profileImageUrl
        accountId
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetTwitterRankingPageQuery__
 *
 * To run a query within a React component, call `useGetTwitterRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTwitterRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTwitterRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetTwitterRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>(
    GetTwitterRankingPageDocument,
    options,
  );
}
export function useGetTwitterRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>(
    GetTwitterRankingPageDocument,
    options,
  );
}
export type GetTwitterRankingPageQueryHookResult = ReturnType<typeof useGetTwitterRankingPageQuery>;
export type GetTwitterRankingPageLazyQueryHookResult = ReturnType<typeof useGetTwitterRankingPageLazyQuery>;
export type GetTwitterRankingPageQueryResult = Apollo.QueryResult<
  GetTwitterRankingPageQuery,
  GetTwitterRankingPageQueryVariables
>;
export const GetYoutubeCategoryRankingPageDocument = gql`
  query getYoutubeCategoryRankingPage($pagination: YoutubeCategoryPaginationInput!) {
    getYoutubeCategoryRankingPage(pagination: $pagination) {
      totalPages
      youtubeChannels {
        id
        title
        thumbnailUrl
        description
        subscriberCount
        viewCount
        videoCount
        hiddenSubscriberCount
        accountId
        mainVideoCategoryId
        keywords {
          keyword {
            title
          }
        }
        channelVideoCategories {
          videoCategory {
            id
            title
          }
        }
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
      youtubeVideoCategories {
        id
        title
      }
    }
  }
`;

/**
 * __useGetYoutubeCategoryRankingPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeCategoryRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeCategoryRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeCategoryRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeCategoryRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeCategoryRankingPageQuery, GetYoutubeCategoryRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetYoutubeCategoryRankingPageQuery, GetYoutubeCategoryRankingPageQueryVariables>(
    GetYoutubeCategoryRankingPageDocument,
    options,
  );
}
export function useGetYoutubeCategoryRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetYoutubeCategoryRankingPageQuery,
    GetYoutubeCategoryRankingPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetYoutubeCategoryRankingPageQuery, GetYoutubeCategoryRankingPageQueryVariables>(
    GetYoutubeCategoryRankingPageDocument,
    options,
  );
}
export type GetYoutubeCategoryRankingPageQueryHookResult = ReturnType<typeof useGetYoutubeCategoryRankingPageQuery>;
export type GetYoutubeCategoryRankingPageLazyQueryHookResult = ReturnType<
  typeof useGetYoutubeCategoryRankingPageLazyQuery
>;
export type GetYoutubeCategoryRankingPageQueryResult = Apollo.QueryResult<
  GetYoutubeCategoryRankingPageQuery,
  GetYoutubeCategoryRankingPageQueryVariables
>;
export const GetYoutubeKeywordIndexPageDocument = gql`
  query getYoutubeKeywordIndexPage($pagination: PaginationInput!) {
    getYoutubeKeywordIndexPage(pagination: $pagination) {
      totalPages
      youtubeKeywords {
        id
        title
      }
    }
  }
`;

/**
 * __useGetYoutubeKeywordIndexPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeKeywordIndexPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeKeywordIndexPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeKeywordIndexPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeKeywordIndexPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeKeywordIndexPageQuery, GetYoutubeKeywordIndexPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetYoutubeKeywordIndexPageQuery, GetYoutubeKeywordIndexPageQueryVariables>(
    GetYoutubeKeywordIndexPageDocument,
    options,
  );
}
export function useGetYoutubeKeywordIndexPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetYoutubeKeywordIndexPageQuery, GetYoutubeKeywordIndexPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetYoutubeKeywordIndexPageQuery, GetYoutubeKeywordIndexPageQueryVariables>(
    GetYoutubeKeywordIndexPageDocument,
    options,
  );
}
export type GetYoutubeKeywordIndexPageQueryHookResult = ReturnType<typeof useGetYoutubeKeywordIndexPageQuery>;
export type GetYoutubeKeywordIndexPageLazyQueryHookResult = ReturnType<typeof useGetYoutubeKeywordIndexPageLazyQuery>;
export type GetYoutubeKeywordIndexPageQueryResult = Apollo.QueryResult<
  GetYoutubeKeywordIndexPageQuery,
  GetYoutubeKeywordIndexPageQueryVariables
>;
export const GetYoutubeKeywordRankingPageDocument = gql`
  query getYoutubeKeywordRankingPage($pagination: YoutubeKeywordPaginationInput!) {
    getYoutubeKeywordRankingPage(pagination: $pagination) {
      youtubeKeyword {
        id
        title
      }
      totalPages
      youtubeChannels {
        id
        title
        thumbnailUrl
        description
        subscriberCount
        viewCount
        videoCount
        hiddenSubscriberCount
        accountId
        mainVideoCategoryId
        keywords {
          keyword {
            title
          }
        }
        channelVideoCategories {
          videoCategory {
            id
            title
          }
        }
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetYoutubeKeywordRankingPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeKeywordRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeKeywordRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeKeywordRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeKeywordRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>(
    GetYoutubeKeywordRankingPageDocument,
    options,
  );
}
export function useGetYoutubeKeywordRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetYoutubeKeywordRankingPageQuery,
    GetYoutubeKeywordRankingPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>(
    GetYoutubeKeywordRankingPageDocument,
    options,
  );
}
export type GetYoutubeKeywordRankingPageQueryHookResult = ReturnType<typeof useGetYoutubeKeywordRankingPageQuery>;
export type GetYoutubeKeywordRankingPageLazyQueryHookResult = ReturnType<
  typeof useGetYoutubeKeywordRankingPageLazyQuery
>;
export type GetYoutubeKeywordRankingPageQueryResult = Apollo.QueryResult<
  GetYoutubeKeywordRankingPageQuery,
  GetYoutubeKeywordRankingPageQueryVariables
>;
export const GetYoutubeVideoTagIndexPageDocument = gql`
  query getYoutubeVideoTagIndexPage($pagination: PaginationInput!) {
    getYoutubeVideoTagIndexPage(pagination: $pagination) {
      totalPages
      youtubeTags {
        id
        title
      }
    }
  }
`;

/**
 * __useGetYoutubeVideoTagIndexPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeVideoTagIndexPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeVideoTagIndexPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeVideoTagIndexPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeVideoTagIndexPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeVideoTagIndexPageQuery, GetYoutubeVideoTagIndexPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetYoutubeVideoTagIndexPageQuery, GetYoutubeVideoTagIndexPageQueryVariables>(
    GetYoutubeVideoTagIndexPageDocument,
    options,
  );
}
export function useGetYoutubeVideoTagIndexPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetYoutubeVideoTagIndexPageQuery,
    GetYoutubeVideoTagIndexPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetYoutubeVideoTagIndexPageQuery, GetYoutubeVideoTagIndexPageQueryVariables>(
    GetYoutubeVideoTagIndexPageDocument,
    options,
  );
}
export type GetYoutubeVideoTagIndexPageQueryHookResult = ReturnType<typeof useGetYoutubeVideoTagIndexPageQuery>;
export type GetYoutubeVideoTagIndexPageLazyQueryHookResult = ReturnType<typeof useGetYoutubeVideoTagIndexPageLazyQuery>;
export type GetYoutubeVideoTagIndexPageQueryResult = Apollo.QueryResult<
  GetYoutubeVideoTagIndexPageQuery,
  GetYoutubeVideoTagIndexPageQueryVariables
>;
export const GetYoutubeVideoTagRankingPageDocument = gql`
  query getYoutubeVideoTagRankingPage($pagination: YoutubeVideoTagPaginationInput!) {
    getYoutubeVideoTagRankingPage(pagination: $pagination) {
      youtubeTag {
        id
        title
      }
      totalPages
      youtubeChannels {
        id
        title
        thumbnailUrl
        description
        subscriberCount
        viewCount
        videoCount
        hiddenSubscriberCount
        accountId
        mainVideoCategoryId
        keywords {
          keyword {
            title
          }
        }
        channelVideoCategories {
          videoCategory {
            id
            title
          }
        }
        account {
          youtubeChannels {
            id
          }
          twitterUsers {
            username
          }
          instagramUsers {
            username
          }
          tiktokUsers {
            uniqueId
          }
        }
      }
    }
  }
`;

/**
 * __useGetYoutubeVideoTagRankingPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeVideoTagRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeVideoTagRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeVideoTagRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeVideoTagRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeVideoTagRankingPageQuery, GetYoutubeVideoTagRankingPageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetYoutubeVideoTagRankingPageQuery, GetYoutubeVideoTagRankingPageQueryVariables>(
    GetYoutubeVideoTagRankingPageDocument,
    options,
  );
}
export function useGetYoutubeVideoTagRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetYoutubeVideoTagRankingPageQuery,
    GetYoutubeVideoTagRankingPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetYoutubeVideoTagRankingPageQuery, GetYoutubeVideoTagRankingPageQueryVariables>(
    GetYoutubeVideoTagRankingPageDocument,
    options,
  );
}
export type GetYoutubeVideoTagRankingPageQueryHookResult = ReturnType<typeof useGetYoutubeVideoTagRankingPageQuery>;
export type GetYoutubeVideoTagRankingPageLazyQueryHookResult = ReturnType<
  typeof useGetYoutubeVideoTagRankingPageLazyQuery
>;
export type GetYoutubeVideoTagRankingPageQueryResult = Apollo.QueryResult<
  GetYoutubeVideoTagRankingPageQuery,
  GetYoutubeVideoTagRankingPageQueryVariables
>;
export const SearchAccountDocument = gql`
  query searchAccount($pagination: AccountSearchInput!) {
    searchAccount(pagination: $pagination) {
      uuid
      displayName
      thumbnailUrl
      youtubeChannels {
        id
        title
      }
      twitterUsers {
        username
        name
      }
      instagramUsers {
        username
        fullName
      }
      tiktokUsers {
        uniqueId
        nickname
      }
    }
  }
`;

/**
 * __useSearchAccountQuery__
 *
 * To run a query within a React component, call `useSearchAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAccountQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchAccountQuery(
  baseOptions: Apollo.QueryHookOptions<SearchAccountQuery, SearchAccountQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchAccountQuery, SearchAccountQueryVariables>(SearchAccountDocument, options);
}
export function useSearchAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchAccountQuery, SearchAccountQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchAccountQuery, SearchAccountQueryVariables>(SearchAccountDocument, options);
}
export type SearchAccountQueryHookResult = ReturnType<typeof useSearchAccountQuery>;
export type SearchAccountLazyQueryHookResult = ReturnType<typeof useSearchAccountLazyQuery>;
export type SearchAccountQueryResult = Apollo.QueryResult<SearchAccountQuery, SearchAccountQueryVariables>;
export const SearchAccountByNameDocument = gql`
  query searchAccountByName($pagination: AccountSearchPaginationInput!) {
    searchAccountByName(pagination: $pagination) {
      totalCount
      totalPages
      accounts {
        uuid
        displayName
        thumbnailUrl
        youtubeChannels {
          id
        }
        twitterUsers {
          username
        }
        instagramUsers {
          username
        }
        tiktokUsers {
          uniqueId
        }
      }
    }
  }
`;

/**
 * __useSearchAccountByNameQuery__
 *
 * To run a query within a React component, call `useSearchAccountByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAccountByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAccountByNameQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchAccountByNameQuery(
  baseOptions: Apollo.QueryHookOptions<SearchAccountByNameQuery, SearchAccountByNameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchAccountByNameQuery, SearchAccountByNameQueryVariables>(
    SearchAccountByNameDocument,
    options,
  );
}
export function useSearchAccountByNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchAccountByNameQuery, SearchAccountByNameQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchAccountByNameQuery, SearchAccountByNameQueryVariables>(
    SearchAccountByNameDocument,
    options,
  );
}
export type SearchAccountByNameQueryHookResult = ReturnType<typeof useSearchAccountByNameQuery>;
export type SearchAccountByNameLazyQueryHookResult = ReturnType<typeof useSearchAccountByNameLazyQuery>;
export type SearchAccountByNameQueryResult = Apollo.QueryResult<
  SearchAccountByNameQuery,
  SearchAccountByNameQueryVariables
>;
export const SearchYoutubeKeywordByWordDocument = gql`
  query searchYoutubeKeywordByWord($input: YoutubeKeywordSearchInput!) {
    searchYoutubeKeywordByWord(input: $input) {
      youtubeKeywords {
        id
        title
      }
      youtubeTags {
        id
        title
      }
    }
  }
`;

/**
 * __useSearchYoutubeKeywordByWordQuery__
 *
 * To run a query within a React component, call `useSearchYoutubeKeywordByWordQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchYoutubeKeywordByWordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchYoutubeKeywordByWordQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchYoutubeKeywordByWordQuery(
  baseOptions: Apollo.QueryHookOptions<SearchYoutubeKeywordByWordQuery, SearchYoutubeKeywordByWordQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchYoutubeKeywordByWordQuery, SearchYoutubeKeywordByWordQueryVariables>(
    SearchYoutubeKeywordByWordDocument,
    options,
  );
}
export function useSearchYoutubeKeywordByWordLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchYoutubeKeywordByWordQuery, SearchYoutubeKeywordByWordQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchYoutubeKeywordByWordQuery, SearchYoutubeKeywordByWordQueryVariables>(
    SearchYoutubeKeywordByWordDocument,
    options,
  );
}
export type SearchYoutubeKeywordByWordQueryHookResult = ReturnType<typeof useSearchYoutubeKeywordByWordQuery>;
export type SearchYoutubeKeywordByWordLazyQueryHookResult = ReturnType<typeof useSearchYoutubeKeywordByWordLazyQuery>;
export type SearchYoutubeKeywordByWordQueryResult = Apollo.QueryResult<
  SearchYoutubeKeywordByWordQuery,
  SearchYoutubeKeywordByWordQueryVariables
>;
