import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccountModel } from "@/models/account.model";
import { YoutubeModule } from "@/modules/youtube.module";
import { AccountService } from "@/services/account.service";

@Module({
  imports: [TypeOrmModule.forFeature([AccountModel]), forwardRef(() => YoutubeModule)],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
