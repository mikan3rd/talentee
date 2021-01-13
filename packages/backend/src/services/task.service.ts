import { Injectable, Logger } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";

import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private youtubeService: YoutubeService) {}

  @Cron("0 0 */6 * * *")
  async saveYoutubeTrendChannel() {
    this.logger.debug("START: saveYoutubeTrendChannel");
    await this.youtubeService.saveTrendChannel();
    this.logger.debug("START: saveYoutubeTrendChannel");
  }

  @Cron("0 0 */8 * * *")
  async bulkUpdateYoutubeChannel() {
    this.logger.debug("START: bulkUpdateYoutubeChannel");
    await this.youtubeService.saveAllChannelVideo(100);
    this.logger.debug("END: bulkUpdateYoutubeChannel");
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
