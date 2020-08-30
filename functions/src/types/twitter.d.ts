type UserBaseType = {
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
};

declare type TwitterUserObjectType = UserBaseType & { created_at: string };
declare type TwitterUserDataType = UserBaseType & { created_at: Date };

declare type TwitterApiErrorType = {
  errors: {
    title: string;
    detail: string;
    resource_type: string;
    parameter: string;
    value: string;
    type: string;
  }[];
};
