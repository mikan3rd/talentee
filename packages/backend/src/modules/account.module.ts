import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { YoutubeModule } from "@/modules/youtube.module";
import { AccountService } from "@/services/account.service";
import { PrismaService } from "@/services/prisma.service";
import { Account } from "typeorm/models/account.model";

@Module({
  imports: [
    // TypeOrmModule.forFeature([Account]), forwardRef(() => YoutubeModule)
  ],
  providers: [AccountService, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
