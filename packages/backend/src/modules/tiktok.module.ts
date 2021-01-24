import { Module } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { TiktokService } from "@/services/tiktok.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [],
  providers: [TiktokService, CrawlService, UtilsService, PrismaService],
  exports: [TiktokService],
})
export class TiktokModule {}
