import { Module } from "@nestjs/common";

import { YoutubeController } from "@/controllers/youtube.controller";
import { CrawlService } from "@/services/crawl.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Module({
  imports: [],
  providers: [YoutubeService, CrawlService, UtilsService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
