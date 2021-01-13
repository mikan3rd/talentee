import { Injectable, Logger } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";

import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private youtubeService: YoutubeService) {}

  @Cron("0 0 */6 * * *")
  async saveYoutubeTrendChannel() {
    await this.youtubeService.saveTrendChannel();
  }

  @Cron("0 0 0 * * SAT")
  async saveYoutubeVideoCategoriesCron() {
    await this.saveYoutubeVideoCategories();
  }

  @Timeout(1000)
  async saveYoutubeVideoCategoriesTimeout() {
    await this.saveYoutubeVideoCategories();
  }

  async saveYoutubeVideoCategories() {
    this.logger.debug("START: saveYoutubeVideoCategories");
    await this.youtubeService.saveVideoCategories();
    this.logger.debug("END: saveYoutubeVideoCategories");
  }
}
