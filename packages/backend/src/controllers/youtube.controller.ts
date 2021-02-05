import { Controller, Post } from "@nestjs/common";

import { YoutubeService } from "@/services/youtube.service";

@Controller("youtube")
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post("/saveTrendChannel")
  async saveTrendChannel() {
    await this.youtubeService.saveTrendChannel();
  }

  @Post("/bulkUpdateYoutubeVideoCategory")
  async bulkUpdateYoutubeVideoCategory() {
    await this.bulkUpdateYoutubeVideoCategory();
  }

  @Post("/bulkUpdateYoutubeChannelVideoCategory")
  async bulkUpdateYoutubeChannelVideoCategory() {
    await this.bulkUpdateYoutubeChannelVideoCategory();
  }

  @Post("/bulkUpdateYoutubeKeyword")
  async bulkUpdateYoutubeKeyword() {
    await this.bulkUpdateYoutubeKeyword();
  }

  @Post("/bulkUpdateVideoTag")
  async bulkUpdateVideoTag() {
    await this.bulkUpdateVideoTag();
  }

  @Post("/bulkUpdateVideoCategory")
  async bulkUpdateVideoCategory() {
    await this.bulkUpdateVideoCategory();
  }
}
