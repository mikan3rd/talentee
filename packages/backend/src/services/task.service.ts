import { Injectable, Logger } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";

import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private youtubeService: YoutubeService) {}

  @Cron("0 * * * * *")
  async handleCron() {
    this.logger.debug("Called when the second is 0");
  }

  @Timeout(1000)
  async saveYoutubeVideoCategories() {
    this.logger.debug("START: saveYoutubeVideoCategories");
    await this.youtubeService.saveVideoCategories();
    this.logger.debug("END: saveYoutubeVideoCategories");
  }
}
