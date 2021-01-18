import { Module } from "@nestjs/common";

import { AccountResolver } from "@/resolvers/account.resolver";
import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [],
  providers: [AccountService, PrismaService, AccountResolver, CrawlService, UtilsService],
  exports: [AccountService],
})
export class AccountModule {}
