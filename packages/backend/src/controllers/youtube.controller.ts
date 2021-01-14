import { Controller, Get } from "@nestjs/common";

import { YoutubeService } from "@/services/youtube.service";

@Controller("youtube")
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get("saveTrendChannel")
  async saveTrendChannel() {
    await this.youtubeService.saveTrendChannel();
    return "SUCCESS: saveTrendChannel";
  }

  @Get("bulkUpdateChannelVideo")
  async bulkUpdateChannelVideo() {
    await this.youtubeService.bulkUpdateChannelVideo(10);
    return "SUCCESS: bulkUpdateChannelVideo";
  }

  @Get("bulkUpdateVideoCategory")
  async bulkUpdateVideoCategory() {
    await this.youtubeService.bulkUpdateVideoCategory();
    return "SUCCESS: bulkUpdateVideoCategory";
  }

  @Get("bulkUpdateChannelVideoCategory")
  async bulkUpdateChannelVideoCategory() {
    await this.youtubeService.bulkUpdateChannelVideoCategory();
    return "SUCCESS: bulkUpdateChannelVideoCategory";
  }
}
