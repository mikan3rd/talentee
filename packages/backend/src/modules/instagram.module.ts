import { Module } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { InstagramService } from "@/services/instagram.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [],
  providers: [InstagramService, CrawlService, UtilsService, PrismaService],
  exports: [InstagramService],
})
export class InstagramModule {}
