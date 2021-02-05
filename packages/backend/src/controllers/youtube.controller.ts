import { Controller, Post } from "@nestjs/common";

import { YoutubeService } from "@/services/youtube.service";

@Controller("youtube")
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post("/saveTrendChannel")
  async saveTrendChannel() {
    await this.youtubeService.saveTrendChannel();
  }

  @Post("/bulkUpdateVideoCategory")
  async bulkUpdateVideoCategory() {
    await this.youtubeService.bulkUpdateVideoCategory();
  }

  @Post("/bulkUpdateChannelVideoCategory")
  async bulkUpdateChannelVideoCategory() {
    await this.youtubeService.bulkUpdateChannelVideoCategory();
  }

  @Post("/bulkUpdateChannelKeyword")
  async bulkUpdateChannelKeyword() {
    await this.youtubeService.bulkUpdateChannelKeyword();
  }

  @Post("/bulkUpdateVideoTag")
  async bulkUpdateVideoTag() {
    await this.youtubeService.bulkUpdateVideoTag();
  }
}
