import { Module } from "@nestjs/common";

import { TiktokController } from "@/controllers/tiktok.controller";
import { TiktokResolver } from "@/resolvers/tiktok.resolver";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { TiktokService } from "@/services/tiktok.service";
import { UtilsService } from "@/services/utils.service";
@Module({
  imports: [],
  providers: [TiktokService, CrawlService, UtilsService, PrismaService, TiktokResolver],
  controllers: [TiktokController],
  exports: [TiktokService],
})
export class TiktokModule {}
