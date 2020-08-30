import * as functions from "firebase-functions";
import axios from "axios";

const {
  twitter: { bearer_token },
} = functions.config();

const endpoint = "https://api.twitter.com";
const version2Endpoint = `${endpoint}/2`;
const headers = { Authorization: `Bearer ${bearer_token}` };

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

const ErrorTitle = "TwitterAPIのレスポンスにエラー";
export class TwitterError extends Error {}
export const TwitterNotFound = "Not Found Error";

type UserResponseType = { data: TwitterUserObjectType };

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
