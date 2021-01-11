import { Module } from "@nestjs/common";

import { AccountResolver } from "@/resolvers/account.resolver";
import { AccountService } from "@/services/account.service";
import { PrismaService } from "@/services/prisma.service";

@Module({
  imports: [],
  providers: [AccountService, PrismaService, AccountResolver],
  exports: [AccountService],
})
export class AccountModule {}
