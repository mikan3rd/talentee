import * as functions from "firebase-functions";
import { google } from "googleapis";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

export const getVideoCategories = async () => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });
  const videoResponse = await service.videoCategories.list({
    part: ["id", "snippet"],
    regionCode: "JP",
    hl: "ja",
  });
  const videoCategories = videoResponse.data.items;
  return videoCategories;
};
