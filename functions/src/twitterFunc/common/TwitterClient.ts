import Twitter from "twitter";

import {
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KET,
} from "../../common/config";

export type TweetObjectType = {
  id_str: string;
  retweeted: boolean;
  retweet_count: number;
  favorited: boolean;
  favorite_count: number;
  user: TweetUserType;
};

export type TweetUserType = {
  id_str: string;
  screen_name: string;
  followers_count: number;
  friends_count: number;
  follow_request_sent: boolean;
  following: boolean;
  blocked_by: boolean;
  followed_by: boolean;
  lang: string;
};

export class TwitterClient {
  client: Twitter;

  constructor(client: Twitter) {
    this.client = client;
  }

  static get(access_token_key: string, access_token_secret: string) {
    const client = new Twitter({
      consumer_key: TWITTER_API_KEY,
      consumer_secret: TWITTER_API_SECRET_KET,
      access_token_key,
      access_token_secret,
    });
    return new TwitterClient(client);
  }

  static getBot() {
    const client = new Twitter({
      consumer_key: TWITTER_API_KEY,
      consumer_secret: TWITTER_API_SECRET_KET,
      access_token_key: TWITTER_ACCESS_TOKEN,
      access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
    });
    return new TwitterClient(client);
  }

  async postTweet(status: string, mediaIds: string[] = []) {
    return await this.client.post("statuses/update", {
      status,
      media_ids: mediaIds.join(","),
    });
  }

  async searchTweet(q: string, count = 100) {
    const response = await this.client.get("search/tweets", {
      q,
      count,
    });
    return response as { statuses: TweetObjectType[] };
  }

  async postRetweet(tweetId: string) {
    return await this.client.post(`statuses/retweet/${tweetId}`, {});
  }
}
