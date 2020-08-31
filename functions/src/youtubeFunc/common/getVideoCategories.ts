import { youtubeService } from "../../common/config";

export const getVideoCategories = async () => {
  const videoResponse = await youtubeService.videoCategories.list({
    part: ["id", "snippet"],
    regionCode: "JP",
    hl: "ja",
  });
  const videoCategories = videoResponse.data.items;
  return videoCategories;
};
