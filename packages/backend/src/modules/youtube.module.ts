import { Module } from "@nestjs/common";

import { YoutubeController } from "@/controllers/youtube.controller";
import { YoutubeResolver } from "@/resolvers/youtube.resolver";
import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Module({
  imports: [],
  providers: [AccountService, YoutubeService, CrawlService, UtilsService, PrismaService, YoutubeResolver],
  controllers: [YoutubeController],
  exports: [YoutubeService],
})
export class YoutubeModule {}
