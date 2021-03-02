import { Module } from "@nestjs/common";

import { TwitterController } from "@/controllers/twitter.controller";
import { TwitterResolver } from "@/resolvers/twitter.resolver";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { TwitterService } from "@/services/twitter.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [],
  providers: [TwitterService, CrawlService, UtilsService, PrismaService, TwitterResolver],
  controllers: [TwitterController],
  exports: [TwitterService],
})
export class TwitterModule {}
