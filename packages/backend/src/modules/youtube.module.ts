import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { YoutubeController } from "@/controllers/youtube.controller";
import { YoutubeVideoCategoryModel } from "@/models/youtubeVideoCategoriy.model";
import { CrawlService } from "@/services/crawl.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeVideoCategoryModel])],
  providers: [YoutubeService, CrawlService, UtilsService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
