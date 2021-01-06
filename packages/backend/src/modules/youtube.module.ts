import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { YoutubeController } from "@/controllers/youtube.controller";
import { YoutubeChannelModel } from "@/models/youtubeChannel.model";
import { YoutubeKeywordModel } from "@/models/youtubeKeyword.model";
import { YoutubeTagModel } from "@/models/youtubeTag.model";
import { YoutubeVideoModel } from "@/models/youtubeVideo.model";
import { YoutubeVideoCategoryModel } from "@/models/youtubeVideoCategoriy.model";
import { AccountModule } from "@/modules/account.module";
import { CrawlService } from "@/services/crawl.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      YoutubeChannelModel,
      YoutubeKeywordModel,
      YoutubeVideoCategoryModel,
      YoutubeVideoModel,
      YoutubeTagModel,
    ]),
    forwardRef(() => AccountModule),
  ],
  providers: [YoutubeService, CrawlService, UtilsService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
