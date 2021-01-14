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

  @Get("bulkUpdateChannel")
  async bulkUpdateChannel() {
    await this.youtubeService.bulkUpdateChannel(10);
    return "SUCCESS: bulkUpdateChannel";
  }

  @Get("bulkUpdateVideoCategory")
  async bulkUpdateVideoCategory() {
    await this.youtubeService.bulkUpdateVideoCategory();
    return "SUCCESS: bulkUpdateVideoCategory";
  }

  @Get("saveChannelVideoCategory")
  async saveChannelVideoCategory() {
    await this.youtubeService.saveChannelVideoCategory();
    return "SUCCESS: saveChannelVideoCategory";
  }
}
