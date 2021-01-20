import { Module } from "@nestjs/common";

import { TwitterModule } from "@/modules/twitter.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { AccountResolver } from "@/resolvers/account.resolver";
import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [YoutubeModule, TwitterModule],
  providers: [AccountService, AccountResolver, PrismaService, CrawlService, UtilsService],
  exports: [AccountService],
})
export class AccountModule {}
