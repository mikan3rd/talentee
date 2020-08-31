import * as functions from "firebase-functions";
import { google } from "googleapis";

const { youtube, twitter } = functions.config();

const YOUTUBE_API_KEY = youtube.api_key;
export const youtubeService = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

export const TWITTER_BEARER_TOKEN = twitter.bearer_token;
export const TWITTER_API_KEY = twitter.api_key;
export const TWITTER_API_SECRET_KET = twitter.api_secret_key;
export const TWITTER_ACCESS_TOKEN = twitter.access_token;
export const TWITTER_ACCESS_TOKEN_SECRET = twitter.access_token_secret;
