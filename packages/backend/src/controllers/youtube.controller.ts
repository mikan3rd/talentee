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

  @Get("saveVideoCategories")
  async saveVideoCategories() {
    await this.youtubeService.saveVideoCategories();
    return "SUCCESS: saveVideoCategories";
  }
}
