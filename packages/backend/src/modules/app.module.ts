import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "@/controllers/app.controller";
import { AccountModule } from "@/modules/account.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { DateScalar } from "@/scalars/date.scalar";
import { AppService } from "@/services/app.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AccountModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService, DateScalar],
})
export class AppModule {}
