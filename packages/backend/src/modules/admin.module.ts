import { Module } from "@nestjs/common";

import { AccountModule } from "@/modules/account.module";
import { AuthModule } from "@/modules/auth.module";
import { InstagramModule } from "@/modules/instagram.module";
import { TiktokModule } from "@/modules/tiktok.module";
import { TwitterModule } from "@/modules/twitter.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { AdminResolver } from "@/resolvers/admin.resolver";
import { AdminService } from "@/services/admin.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Module({
  imports: [AuthModule, AccountModule, YoutubeModule, TwitterModule, InstagramModule, TiktokModule],
  providers: [AdminResolver, AdminService, PrismaService, UtilsService],
  controllers: [],
  exports: [],
})
export class AdminModule {}
