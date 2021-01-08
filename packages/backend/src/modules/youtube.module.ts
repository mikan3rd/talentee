import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { YoutubeController } from "@/controllers/youtube.controller";
import { AccountModule } from "@/modules/account.module";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";
import { YoutubeChannel } from "typeorm/models/youtubeChannel.model";
import { YoutubeKeyword } from "typeorm/models/youtubeKeyword.model";
import { YoutubeTag } from "typeorm/models/youtubeTag.model";
import { YoutubeVideo } from "typeorm/models/youtubeVideo.model";
import { YoutubeVideoCategory } from "typeorm/models/youtubeVideoCategoriy.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([YoutubeChannel, YoutubeKeyword, YoutubeVideoCategory, YoutubeVideo, YoutubeTag]),
    forwardRef(() => AccountModule),
  ],
  providers: [YoutubeService, CrawlService, UtilsService, PrismaService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
