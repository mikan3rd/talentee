import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type YoutubeKeyword = {
  id: Scalars["Float"];
  title: Scalars["String"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  channels: Array<YoutubeChannel>;
};

export type YoutubeChannelKeywordRelation = {
  channelId: Scalars["ID"];
  keywordId: Scalars["ID"];
  channel: YoutubeChannel;
  keyword: YoutubeKeyword;
};

export type YoutubeTag = {
  id: Scalars["Float"];
  title: Scalars["String"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  videos: Array<YoutubeVideo>;
};

export type YoutubeVideoTagRelation = {
  videoId: Scalars["ID"];
  tagOd: Scalars["ID"];
  video: YoutubeVideo;
  tag: YoutubeTag;
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

export type YoutubeChannelVideoCategory = {
  channelId: Scalars["ID"];
  videoCategoryId: Scalars["Float"];
  num: Scalars["Float"];
  createdAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  channel: YoutubeChannel;
  videoCategory: YoutubeVideoCategory;
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

export type InstagramRankingPage = {
  totalPages: Scalars["Int"];
  instagramUsers: Array<InstagramUser>;
};

export type TiktokRankingPage = {
  totalPages: Scalars["Int"];
  tiktokUsers: Array<TiktokUser>;
};

export type TwitterRankingPage = {
  totalPages: Scalars["Int"];
  twitterUsers: Array<TwitterUser>;
};

export type YoutubeRankingPage = {
  totalPages: Scalars["Int"];
  youtubeChannels: Array<YoutubeChannel>;
  youtubeVideoCategories: Array<YoutubeVideoCategory>;
};

export type AccountSearchResult = {
  totalPages: Scalars["Int"];
  accounts: Array<Account>;
};

export type Sitemap = {
  accounts: Array<Account>;
  youtubeVideoCategories: Array<YoutubeVideoCategory>;
};

export type TopPage = {
  youtubeChannels: Array<YoutubeChannel>;
  twitterUsers: Array<TwitterUser>;
  instagramUsers: Array<InstagramUser>;
  tiktokUsers: Array<TiktokUser>;
};

export type Query = {
  getAccountPage?: Maybe<Account>;
  getTopPage: TopPage;
  searchAccount: AccountSearchResult;
  getSitemapData: Sitemap;
  getYoutubeRankingPage: YoutubeRankingPage;
  getTwitterRankingPage: TwitterRankingPage;
  getInstagramRankingPage: InstagramRankingPage;
  getTiktokRankingPage: TiktokRankingPage;
};

export type QueryGetAccountPageArgs = {
  uuid: Scalars["ID"];
};

export type QuerySearchAccountArgs = {
  pagination: AccountSearchInput;
};

export type QueryGetYoutubeRankingPageArgs = {
  pagination: YoutubePaginationInput;
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

export type AccountSearchInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  word: Scalars["String"];
};

export type YoutubePaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
  videoCategoryId?: Maybe<Scalars["Int"]>;
  isAll: Scalars["Boolean"];
};

export type PaginationInput = {
  take: Scalars["Int"];
  page: Scalars["Int"];
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
              tags: Array<{ tag: Pick<YoutubeTag, "title"> }>;
            }
          >;
          keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
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

export type GetInstagramRankingPageQueryVariables = Exact<{
  pagination: PaginationInput;
}>;

export type GetInstagramRankingPageQuery = {
  getInstagramRankingPage: Pick<InstagramRankingPage, "totalPages"> & {
    instagramUsers: Array<
      Pick<InstagramUser, "username" | "fullName" | "biography" | "profilePicUrl" | "followedBy" | "accountId">
    >;
  };
};

export type GetSitemapDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetSitemapDataQuery = {
  getSitemapData: {
    accounts: Array<Pick<Account, "uuid">>;
    youtubeVideoCategories: Array<Pick<YoutubeVideoCategory, "id">>;
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
      >
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
      }
    >;
    twitterUsers: Array<
      Pick<
        TwitterUser,
        "username" | "name" | "description" | "followersCount" | "tweetCount" | "profileImageUrl" | "accountId"
      >
    >;
    instagramUsers: Array<
      Pick<InstagramUser, "username" | "fullName" | "biography" | "profilePicUrl" | "followedBy" | "accountId">
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
      >
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
      >
    >;
  };
};

export type GetYoutubeRankingPageQueryVariables = Exact<{
  pagination: YoutubePaginationInput;
}>;

export type GetYoutubeRankingPageQuery = {
  getYoutubeRankingPage: Pick<YoutubeRankingPage, "totalPages"> & {
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
      }
    >;
    youtubeVideoCategories: Array<Pick<YoutubeVideoCategory, "id" | "title">>;
  };
};

export type SearchAccountQueryVariables = Exact<{
  pagination: AccountSearchInput;
}>;

export type SearchAccountQuery = {
  searchAccount: Pick<AccountSearchResult, "totalPages"> & {
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
              title
            }
          }
        }
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
  return Apollo.useQuery<GetAccountPageQuery, GetAccountPageQueryVariables>(GetAccountPageDocument, baseOptions);
}
export function useGetAccountPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAccountPageQuery, GetAccountPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetAccountPageQuery, GetAccountPageQueryVariables>(GetAccountPageDocument, baseOptions);
}
export type GetAccountPageQueryHookResult = ReturnType<typeof useGetAccountPageQuery>;
export type GetAccountPageLazyQueryHookResult = ReturnType<typeof useGetAccountPageLazyQuery>;
export type GetAccountPageQueryResult = Apollo.QueryResult<GetAccountPageQuery, GetAccountPageQueryVariables>;
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
  return Apollo.useQuery<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>(
    GetInstagramRankingPageDocument,
    baseOptions,
  );
}
export function useGetInstagramRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>(
    GetInstagramRankingPageDocument,
    baseOptions,
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
      }
      youtubeVideoCategories {
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
  return Apollo.useQuery<GetSitemapDataQuery, GetSitemapDataQueryVariables>(GetSitemapDataDocument, baseOptions);
}
export function useGetSitemapDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSitemapDataQuery, GetSitemapDataQueryVariables>,
) {
  return Apollo.useLazyQuery<GetSitemapDataQuery, GetSitemapDataQueryVariables>(GetSitemapDataDocument, baseOptions);
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
  return Apollo.useQuery<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>(
    GetTiktokRankingPageDocument,
    baseOptions,
  );
}
export function useGetTiktokRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>(
    GetTiktokRankingPageDocument,
    baseOptions,
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
      }
      twitterUsers {
        username
        name
        description
        followersCount
        tweetCount
        profileImageUrl
        accountId
      }
      instagramUsers {
        username
        fullName
        biography
        profilePicUrl
        followedBy
        accountId
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
  return Apollo.useQuery<GetTopPageQuery, GetTopPageQueryVariables>(GetTopPageDocument, baseOptions);
}
export function useGetTopPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTopPageQuery, GetTopPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetTopPageQuery, GetTopPageQueryVariables>(GetTopPageDocument, baseOptions);
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
  return Apollo.useQuery<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>(
    GetTwitterRankingPageDocument,
    baseOptions,
  );
}
export function useGetTwitterRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>(
    GetTwitterRankingPageDocument,
    baseOptions,
  );
}
export type GetTwitterRankingPageQueryHookResult = ReturnType<typeof useGetTwitterRankingPageQuery>;
export type GetTwitterRankingPageLazyQueryHookResult = ReturnType<typeof useGetTwitterRankingPageLazyQuery>;
export type GetTwitterRankingPageQueryResult = Apollo.QueryResult<
  GetTwitterRankingPageQuery,
  GetTwitterRankingPageQueryVariables
>;
export const GetYoutubeRankingPageDocument = gql`
  query getYoutubeRankingPage($pagination: YoutubePaginationInput!) {
    getYoutubeRankingPage(pagination: $pagination) {
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
      }
      youtubeVideoCategories {
        id
        title
      }
    }
  }
`;

/**
 * __useGetYoutubeRankingPageQuery__
 *
 * To run a query within a React component, call `useGetYoutubeRankingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYoutubeRankingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYoutubeRankingPageQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetYoutubeRankingPageQuery(
  baseOptions: Apollo.QueryHookOptions<GetYoutubeRankingPageQuery, GetYoutubeRankingPageQueryVariables>,
) {
  return Apollo.useQuery<GetYoutubeRankingPageQuery, GetYoutubeRankingPageQueryVariables>(
    GetYoutubeRankingPageDocument,
    baseOptions,
  );
}
export function useGetYoutubeRankingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetYoutubeRankingPageQuery, GetYoutubeRankingPageQueryVariables>,
) {
  return Apollo.useLazyQuery<GetYoutubeRankingPageQuery, GetYoutubeRankingPageQueryVariables>(
    GetYoutubeRankingPageDocument,
    baseOptions,
  );
}
export type GetYoutubeRankingPageQueryHookResult = ReturnType<typeof useGetYoutubeRankingPageQuery>;
export type GetYoutubeRankingPageLazyQueryHookResult = ReturnType<typeof useGetYoutubeRankingPageLazyQuery>;
export type GetYoutubeRankingPageQueryResult = Apollo.QueryResult<
  GetYoutubeRankingPageQuery,
  GetYoutubeRankingPageQueryVariables
>;
export const SearchAccountDocument = gql`
  query searchAccount($pagination: AccountSearchInput!) {
    searchAccount(pagination: $pagination) {
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
  return Apollo.useQuery<SearchAccountQuery, SearchAccountQueryVariables>(SearchAccountDocument, baseOptions);
}
export function useSearchAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchAccountQuery, SearchAccountQueryVariables>,
) {
  return Apollo.useLazyQuery<SearchAccountQuery, SearchAccountQueryVariables>(SearchAccountDocument, baseOptions);
}
export type SearchAccountQueryHookResult = ReturnType<typeof useSearchAccountQuery>;
export type SearchAccountLazyQueryHookResult = ReturnType<typeof useSearchAccountLazyQuery>;
export type SearchAccountQueryResult = Apollo.QueryResult<SearchAccountQuery, SearchAccountQueryVariables>;
