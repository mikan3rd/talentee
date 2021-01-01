type TwitterUserBaseType = {
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

declare type TwitterUserObjectType = TwitterUserBaseType & {
  accountRef: firebase.firestore.DocumentReference;
  created_at: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};
declare type TwitterUserDataType = TwitterUserBaseType & {
  created_at: number;
  createdAt: number;
  updatedAt: number;
};

type TweetBaseType = {
  context_annotations: {
    domain: {
      id: string;
      name: string;
      description: string;
    };
    entity: {
      id: string;
      name: string;
      description: string;
    };
  }[];
  author_id: string;
  lang: string;
  source: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  conversation_id: string;
  id: string;
  entities: {
    urls: {
      start: number;
      end: number;
      url: string;
      expanded_url: string;
      display_url: string;
      status: number;
      unwound_url: string;
    }[];
    annotations: {
      start: number;
      end: number;
      probability: number;
      type: string;
      normalized_text: string;
    }[];
    hashtags: {
      start: number;
      end: number;
      tag: number;
    }[];
  };
  text: string;
  possibly_sensitive: boolean;
  attachments: {
    media_keys: string[];
  };
};

declare type TweetObjectType = TweetBaseType & {
  created_at: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};
declare type TweetDataType = TweetBaseType & {
  created_at: number;
  createdAt: number;
  updatedAt: number;
};
