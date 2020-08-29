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

export const getUserByUsername = async (username: string) => {
  const url = `${version2Endpoint}/users/by/username/${username}`;
  const params = { "user.fields": userFields.join(",") };
  return await axios.get<{ data: TwitterUserObjectType }>(url, { params, headers });
};

export const getUserById = async (id: string) => {
  const url = `${version2Endpoint}/users/${id}`;
  const params = { "user.fields": userFields.join(",") };
  return await axios.get<{ data: TwitterUserObjectType }>(url, { params, headers });
};
