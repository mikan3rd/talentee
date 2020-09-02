import axios from "axios";

import { TWITTER_BEARER_TOKEN } from "../../common/config";

const endpoint = "https://api.twitter.com";
const version2Endpoint = `${endpoint}/2`;
const headers = { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` };

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

const ErrorTitle = "TwitterAPIのレスポンスにエラー";
export class TwitterError extends Error {}
export const TwitterNotFound = "Not Found Error";

type UserResponseType = { data: TwitterUserObjectType };
type TweetsResponseType = { data: TweetObjectType[] };

export const getUserByUsername = async (username: string) => {
  const url = `${version2Endpoint}/users/by/username/${username}`;
  const params = { "user.fields": userFields.join(",") };
  const { data } = await axios.get<UserResponseType | TwitterApiErrorType>(url, { params, headers });
  if (hasError(data)) {
    const error = handleError(data);
    throw error;
  }
  return data;
};

export const getUserById = async (id: string) => {
  const url = `${version2Endpoint}/users/${id}`;
  const params = { "user.fields": userFields.join(",") };
  const { data } = await axios.get<UserResponseType | TwitterApiErrorType>(url, { params, headers });
  if (hasError(data)) {
    const error = handleError(data);
    throw error;
  }
  return data;
};

export const getTweets = async (ids: string[]) => {
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
  const { data } = await axios.get<TweetsResponseType | TwitterApiErrorType>(url, { params, headers });
  if (hasError(data)) {
    const error = handleError(data);
    throw error;
  }
  return data;
};

const hasError = (responseData): responseData is TwitterApiErrorType => {
  return "errors" in responseData;
};

const handleError = (data: TwitterApiErrorType) => {
  console.error(JSON.stringify(data.errors));
  const error = new TwitterError(ErrorTitle);
  error.name = data.errors[0].title;
  error.stack = JSON.stringify(data.errors);
  return error;
};
