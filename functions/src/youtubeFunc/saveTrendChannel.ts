import { chunk } from "../common/utils";
import { youtubeService } from "../common/config";

import { saveChannel } from "./common/saveChannel";
import { getTrendVideoIds } from "./common/getTrendVideoIds";

export const saveTrendChannel = async () => {
  const videoIds = await getTrendVideoIds();

  let channnelIds: string[] = [];
  for (const chunkVideoIds of chunk(videoIds, 50)) {
    const videoResponse = await youtubeService.videos.list({
      part: ["id", "snippet", "contentDetails", "statistics", "player"],
      hl: "ja",
      regionCode: "JP",
      id: chunkVideoIds,
    });
    channnelIds = channnelIds.concat(videoResponse.data.items.map((item) => item.snippet.channelId));
  }

  await saveChannel(channnelIds);
};
