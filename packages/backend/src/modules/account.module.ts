import { Module } from "@nestjs/common";

import { AccountService } from "@/services/account.service";
import { PrismaService } from "@/services/prisma.service";

@Module({
  imports: [],
  providers: [AccountService, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
