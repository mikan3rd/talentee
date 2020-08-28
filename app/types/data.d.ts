declare interface IAccountData {
  tmpUsername: string;
  thumbnailUrl: string;
  youtubeMainRef?: FirebaseFirestore.DocumentReference;
  twitterMainRef?: FirebaseFirestore.DocumentReference;
}

declare interface IYoutubeData {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    country: string;
    publishedAt: string;
  };
  statistics: { subscriberCount: number; videoCount: number; viewCount: number; hiddenSubscriberCount: boolean };
  brandingSettings: { channel: { keywords: string[] } };
  accountRef: { id: string };
  videoCategories: { snippet: { title: string } }[];
  updatedAt: number;
}

declare interface IYoutubeVideoData {
  id: string;
  snippet: { title: string; description: string; publishedAt: string; tags?: string[] };
  statistics: { viewCount: number; likeCount?: number; dislikeCount?: number; commentCount: number };
  player: { embedHtml: string };
  videoCategory: { snippet: { title: string } };
}

declare type TwitterDataType = {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    country: string;
    publishedAt: string;
  };
  statistics: { subscriberCount: number; videoCount: number; viewCount: number; hiddenSubscriberCount: boolean };
  brandingSettings: { channel: { keywords: string[] } };
  accountRef: { id: string };
  videoCategories: { snippet: { title: string } }[];
  updatedAt: number;
};

declare type TwitterUserDataType = {
  verified: boolean;
  id: string;
  username: string;
  protected: boolean;
  pinned_tweet_id: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  profile_image_url: string;
  name: string;
  url: string;
  entities: { url: { urls: { start: number; end: number; url: string; expanded_url: string; display_url: string }[] } };
  description: string;
  created_at: number;
};
