import { Module } from "@nestjs/common";

import { InstagramController } from "@/controllers/instagram.controller";
import { InstagramResolver } from "@/resolvers/instagram.resolver";
import { CrawlService } from "@/services/crawl.service";
import { InstagramService } from "@/services/instagram.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [],
  providers: [InstagramService, CrawlService, UtilsService, PrismaService, InstagramResolver],
  controllers: [InstagramController],
  exports: [InstagramService],
})
export class InstagramModule {}
