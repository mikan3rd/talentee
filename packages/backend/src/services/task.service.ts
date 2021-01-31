import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, SchedulerRegistry, Timeout } from "@nestjs/schedule";

import { AccountService } from "@/services/account.service";
import { InstagramService } from "@/services/instagram.service";
import { TiktokService } from "@/services/tiktok.service";
import { TwitterService } from "@/services/twitter.service";
import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private accountService: AccountService,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
    private instagramService: InstagramService,
    private tiktokService: TiktokService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Cron("0 0 0 * * *")
  async bulkUpdateYoutubeVideoCategoryCron() {
    await this.bulkUpdateYoutubeVideoCategory();
  }

  @Cron("0 1 0 * * *")
  async bulkUpdateYoutubeChannelVideoCategory() {
    this.logger.debug("START: bulkUpdateYoutubeChannelVideoCategory");
    await this.youtubeService.bulkUpdateChannelVideoCategory();
    this.logger.debug("END: bulkUpdateYoutubeChannelVideoCategory");
  }

  @Cron("0 2 0 * * *")
  async bulkUpdateYoutubeKeyword() {
    this.logger.debug("START: bulkUpdateYoutubeKeyword");
    await this.youtubeService.bulkUpdateChannelKeyword();
    this.logger.debug("END: bulkUpdateYoutubeKeyword");
  }

  @Cron("0 3 0 * * *")
  async bulkUpdateYoutubeVideoTag() {
    this.logger.debug("START: bulkUpdateYoutubeVideoTag");
    await this.youtubeService.bulkUpdateVideoTag();
    this.logger.debug("END: bulkUpdateYoutubeVideoTag");
  }

  @Cron("0 0 */6 * * *")
  async saveYoutubeTrendChannel() {
    this.logger.debug("START: saveYoutubeTrendChannel");
    await this.youtubeService.saveTrendChannel();
    this.logger.debug("END: saveYoutubeTrendChannel");
  }

  @Cron("0 0 1,9,17 * * *")
  async bulkAddServiceByYoutube() {
    this.logger.debug("START: bulkAddServiceByYoutube");
    await this.accountService.addServiceByYoutube(100);
    this.logger.debug("END: bulkAddServiceByYoutube");
  }

  @Cron("0 10 1,9,17 * * *")
  async bulkAddServiceByTwitter() {
    this.logger.debug("START: bulkAddServiceByTwitter");
    await this.accountService.addServiceByTwitter(100);
    this.logger.debug("END: bulkAddServiceByTwitter");
  }

  // @Cron("0 30 2,10,18 * * *")
  // async bulkUpsertTwitter() {
  //   this.logger.debug("START: bulkUpsertTwitter");
  //   await this.twitterService.bulkUpsert(100);
  //   this.logger.debug("END: bulkUpsertTwitter");
  // }

  // @Cron("0 40 2,10,18 * * *")
  // async bulkUpdateTiktok() {
  //   this.logger.debug("START: bulkUpdateTiktok");
  //   await this.tiktokService.bulkUpdate(100);
  //   this.logger.debug("END: bulkUpdateTiktok");
  // }

  // @Cron("0 50 2,10,18 * * *")
  // async bulkUpdateInstagram() {
  //   this.logger.debug("START: bulkUpdateInstagram");
  //   await this.instagramService.bulkUpdate(100);
  //   this.logger.debug("END: bulkUpdateInstagram");
  // }

  @Cron("0 30 2,10,18 * * *")
  async bulkUpdateAccount() {
    this.logger.debug("START: bulkUpdateAccount");
    await this.accountService.bulkUpdate(100);
    this.logger.debug("END: bulkUpdateAccount");
  }

  // @Timeout(1000)
  async bulkUpdateYoutubeVideoCategoryTimeout() {
    await this.bulkUpdateYoutubeVideoCategory();
  }

  async bulkUpdateYoutubeVideoCategory() {
    this.logger.debug("START: bulkUpdateYoutubeVideoCategory");
    await this.youtubeService.bulkUpdateVideoCategory();
    this.logger.debug("END: bulkUpdateYoutubeVideoCategory");
  }

  @Timeout(0)
  handleCron() {
    if (this.configService.get("SCHEDULE_ENABLED") !== "true") {
      const timeoutJobs = this.schedulerRegistry.getTimeouts();
      timeoutJobs.forEach((job, key, map) => this.schedulerRegistry.deleteTimeout(job));
      const cronJobs = this.schedulerRegistry.getCronJobs();
      cronJobs.forEach((job, key, map) => job.stop());
      this.logger.debug("SUCCESS: stop cron job");
    }
  }
}
