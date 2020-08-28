import * as functions from "firebase-functions";
import axios from "axios";

const {
  twitter: { bearer_token },
} = functions.config();

const endpoint = "https://api.twitter.com";
const version2Endpoint = `${endpoint}/2`;
const headers = { Authorization: `Bearer ${bearer_token}` };

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

export type UserObjectType = UserBaseType & { created_at: string };
export type UserDataType = UserBaseType & { created_at: Date };

export const getUserByUsername = async (username: string) => {
  const url = `${version2Endpoint}/users/by/username/${username}`;
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
  const params = { "user.fields": userFields.join(",") };
  return await axios.get<{ data: UserObjectType }>(url, { params, headers });
};
