import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import axios from "axios";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  get headers() {
    return { Authorization: `Bearer ${this.configService.get("TWITTER_BEARER_TOKEN")}` };
  }

  async upsertUserByUsername(_username: string, _accountId?: string) {
    const response = await this.getUserByUsername(_username);

    if (!response) {
      this.logger.warn("Twitter user not found");
      return;
    }

    const tweetResponse = await this.searchRecentTweets(`from:${_username}`);

    if (!tweetResponse) {
      return;
    }

    const tweets = tweetResponse.data
      .sort((a, b) => (a.public_metrics.retweet_count > b.public_metrics.retweet_count ? -1 : 1))
      .slice(0, 3);

    const {
      data: {
        id: userId,
        name,
        username,
        description,
        profile_image_url,
        verified,
        protected: _protected,
        created_at,
        public_metrics: { followers_count, following_count, listed_count, tweet_count },
      },
    } = response;

    const account = await this.prisma.twitterUser.findUnique({ where: { id: userId } }).account();
    const accountId = account?.uuid ?? _accountId;

    const twitteUser: Prisma.TwitterUserCreateInput = {
      id: userId,
      name,
      username,
      description,
      profileImageUrl: profile_image_url,
      followersCount: followers_count,
      followingCount: following_count,
      listedCount: listed_count,
      tweetCount: tweet_count,
      verified,
      protected: _protected,
      createdTimestamp: created_at,
      account: {
        connectOrCreate: {
          where: { uuid: accountId ?? "" },
          create: {
            displayName: name,
            username,
            thumbnailUrl: profile_image_url,
          },
        },
      },
    };

    const twitterTweets = tweets.map((tweet) => {
      const {
        id,
        text,
        possibly_sensitive,
        created_at,
        public_metrics: { reply_count, like_count, quote_count, retweet_count },
        author_id,
      } = tweet;
      const twitterTweet: Prisma.TwitterTweetCreateInput = {
        id,
        text,
        possiblySensitive: possibly_sensitive,
        retweetCount: retweet_count,
        likeCount: like_count,
        quoteCount: quote_count,
        replyCount: reply_count,
        createdTimestamp: new Date(created_at),
        user: { connect: { id: author_id } },
      };
      return this.prisma.twitterTweet.upsert({
        where: { id },
        create: twitterTweet,
        update: twitterTweet,
      });
    });

    await this.prisma.twitterUser.upsert({
      where: { id: twitteUser.id },
      create: twitteUser,
      update: twitteUser,
    });

    await this.prisma.$transaction(twitterTweets);
  }

  async getUserByUsername(username: string) {
    const url = `${version2Endpoint}/users/by/username/${username}`;
    const params = { "user.fields": userFields.join(",") };
    const { data } = await axios.get<UserResponseType | TwitterApiErrorType>(url, { params, headers: this.headers });
    if (this.hasError(data)) {
      return this.handleError(data);
    }
    return data;
  }

  async getUserById(id: string) {
    const url = `${version2Endpoint}/users/${id}`;
    const params = { "user.fields": userFields.join(",") };
    const { data } = await axios.get<UserResponseType | TwitterApiErrorType>(url, { params, headers: this.headers });
    if (this.hasError(data)) {
      return this.handleError(data);
    }
    return data;
  }

  async getTweets(ids: string[]) {
    const url = `${version2Endpoint}/tweets`;
    const params = {
      ids: ids.join(","),
      "user.fields": userFields.join(","),
      "tweet.fields": tweetFields.join(","),
      "media.fields": mediaFields.join(","),
      "place.fields": placeFields.join(","),
      "poll.fields": pollFields.join(","),
      expansions: expansions.join(","),
    };
    const { data } = await axios.get<TweetsResponseType | TwitterApiErrorType>(url, { params, headers: this.headers });
    if (this.hasError(data)) {
      return this.handleError(data);
    }
    return data;
  }

  async searchRecentTweets(query: string) {
    const url = `${version2Endpoint}/tweets/search/recent`;
    const params = {
      query,
      "user.fields": userFields.join(","),
      "tweet.fields": tweetFields.join(","),
      "media.fields": mediaFields.join(","),
      "place.fields": placeFields.join(","),
      "poll.fields": pollFields.join(","),
      max_results: 100,
      expansions: expansions.join(","),
    };
    const { data } = await axios.get<TweetsResponseType | TwitterApiErrorType>(url, { params, headers: this.headers });
    if (this.hasError(data)) {
      return this.handleError(data);
    }
    return data;
  }

  private hasError(responseData: Record<string, unknown>): responseData is TwitterApiErrorType {
    return "errors" in responseData;
  }

  private handleError(data: TwitterApiErrorType) {
    this.logger.error(JSON.stringify(data.errors));
    const firstError = data.errors[0];

    if (firstError.title === "Not Found Error" || firstError.title === "Forbidden") {
      return null;
    }

    const error = new TwitterError("TwitterAPIのレスポンスにエラー");
    error.name = firstError.title;
    error.stack = JSON.stringify(data.errors);
    throw error;
  }
}

const endpoint = "https://api.twitter.com";
const version2Endpoint = `${endpoint}/2`;

const userFields = [
  "created_at",
  "description",
  "entities",
  "id",
  "location",
  "name",
  "pinned_tweet_id",
  "profile_image_url",
  "protected",
  "public_metrics",
  "url",
  "username",
  "verified",
  "withheld",
];

const tweetFields = [
  "attachments",
  "author_id",
  "context_annotations",
  "conversation_id",
  "created_at",
  "entities",
  "geo",
  "id",
  "in_reply_to_user_id",
  "lang",
  "possibly_sensitive",
  "public_metrics",
  "referenced_tweets",
  "source",
  "text",
  "withheld",
];

const mediaFields = [
  "duration_ms",
  "height",
  "media_key",
  "preview_image_url",
  "public_metrics",
  "type",
  "url",
  "width",
];

const placeFields = ["contained_within", "country", "country_code", "full_name", "geo", "id", "name", "place_type"];

const pollFields = ["duration_minutes", "end_datetime", "id", "options", "voting_status"];

const expansions = [
  "author_id",
  "referenced_tweets.id",
  "referenced_tweets.id.author_id",
  "entities.mentions.username",
  "attachments.poll_ids",
  "attachments.media_keys",
  "in_reply_to_user_id",
  "geo.place_id",
];

class TwitterError extends Error {}

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
  entities?: {
    url?: { urls: { start: number; end: number; url: string; expanded_url: string; display_url: string }[] };
  };
  description: string;
  created_at: string;
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
  created_at: string;
};

type UserResponseType = { data: UserBaseType };
type TweetsResponseType = { data: TweetBaseType[] };

type TwitterApiErrorType = {
  errors: {
    title: string;
    detail: string;
    resource_type: string;
    parameter: string;
    value: string;
    type: string;
  }[];
};
