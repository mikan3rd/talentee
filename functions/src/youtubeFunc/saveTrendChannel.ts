import * as functions from "firebase-functions";
import { google } from "googleapis";

import { chunk } from "../common/utils";

import { saveChannel } from "./common/saveChannel";
import { getTrendVideoIds } from "./common/getTrendVideoIds";

const YOUTUBE_API_KEY = functions.config().youtube.api_key;

export const saveTrendChannel = async () => {
  const videoIds = await getTrendVideoIds();

  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  let channnelIds: string[] = [];
  for (const chunkVideoIds of chunk(videoIds, 50)) {
    const videoResponse = await service.videos.list({
      part: ["id", "snippet", "contentDetails", "statistics", "player"],
      hl: "ja",
      regionCode: "JP",
      id: chunkVideoIds,
    });
    channnelIds = channnelIds.concat(videoResponse.data.items.map((item) => item.snippet.channelId));
  }

  await saveChannel(channnelIds);
};
