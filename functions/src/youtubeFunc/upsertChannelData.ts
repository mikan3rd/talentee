import { youtubeService } from "../common/config";

import { formatChannelData } from "./common/formatYoutubeData";
import { updateChannel } from "./common/updateChannel";

export const upsertChannelData = async (accountId: string, channelId: string) => {
  console.log(`accountId: ${accountId}, channelId: ${channelId}`);

  const channelResponse = await youtubeService.channels.list({
    part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
    id: [channelId],
  });

  if (!channelResponse.data.items) {
    console.error(`NOT FOUND: accountId: ${accountId}, channelId: ${channelId}`);
    return false;
  }

  const channelData = formatChannelData(channelResponse.data.items[0]);
  await updateChannel(accountId, channelData);

  return true;
};
