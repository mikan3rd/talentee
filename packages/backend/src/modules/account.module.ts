import { Module } from "@nestjs/common";

import { AccountController } from "@/controllers/account.controller";
import { InstagramModule } from "@/modules/instagram.module";
import { TiktokModule } from "@/modules/tiktok.module";
import { TwitterModule } from "@/modules/twitter.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { AccountResolver } from "@/resolvers/account.resolver";
import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [YoutubeModule, TwitterModule, InstagramModule, TiktokModule],
  providers: [AccountService, AccountResolver, PrismaService, CrawlService, UtilsService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
