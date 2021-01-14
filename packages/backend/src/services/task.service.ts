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
  async bulkUpdateYoutubeChannelVideo() {
    this.logger.debug("START: bulkUpdateYoutubeChannelVideo");
    await this.youtubeService.bulkUpdateChannelVideo(100);
    this.logger.debug("END: bulkUpdateYoutubeChannelVideo");
  }

  @Cron("0 0 0 * * SAT")
  async bulkUpdateYoutubeVideoCategoryCron() {
    await this.bulkUpdateYoutubeVideoCategory();
  }

  @Timeout(1000)
  async bulkUpdateYoutubeVideoCategoryTimeout() {
    await this.bulkUpdateYoutubeVideoCategory();
  }

  async bulkUpdateYoutubeVideoCategory() {
    this.logger.debug("START: bulkUpdateYoutubeVideoCategory");
    await this.youtubeService.bulkUpdateVideoCategory();
    this.logger.debug("END: bulkUpdateYoutubeVideoCategory");
  }
}
