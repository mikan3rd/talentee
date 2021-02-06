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
  /** Date custom scalar type */
  Date: number;
  /** BigInt custom scalar type */
  BigInt: number;
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
  account: Account;
  mediaList: Array<InstagramMedia>;
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
  account: Account;
  tweets: Array<TwitterTweet>;
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
  keywords: Array<YoutubeChannelKeywordRelation>;
  videos: Array<YoutubeVideo>;
  account: Account;
  channelVideoCategories: Array<YoutubeChannelVideoCategory>;
};

export type Query = {
  getAccountPage?: Maybe<Account>;
  youtubeChannelByMainVideoCategory: Array<YoutubeChannel>;
};

export type QueryGetAccountPageArgs = {
  uuid: Scalars["ID"];
};

export type QueryYoutubeChannelByMainVideoCategoryArgs = {
  videoCategoryId: Scalars["Int"];
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
        > & {
          videos: Array<
            Pick<YoutubeVideo, "id" | "title" | "publishedAt" | "viewCount" | "likeCount" | "dislikeCount"> & {
              tags: Array<{ tag: Pick<YoutubeTag, "title"> }>;
            }
          >;
          keywords: Array<{ keyword: Pick<YoutubeKeyword, "title"> }>;
          channelVideoCategories: Array<{ videoCategory: Pick<YoutubeVideoCategory, "title"> }>;
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
