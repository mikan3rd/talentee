import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";

import { SentryInterceptor } from "@/interceptors/sentry.interceptor";
import { AccountModule } from "@/modules/account.module";
import { AdminModule } from "@/modules/admin.module";
import { AuthModule } from "@/modules/auth.module";
import { InstagramModule } from "@/modules/instagram.module";
import { TiktokModule } from "@/modules/tiktok.module";
import { TwitterModule } from "@/modules/twitter.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { BigIntScalar } from "@/scalars/bigint.scalar";
import { DateScalar } from "@/scalars/date.scalar";
// import { TaskModule } from "@/modules/task.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({ autoSchemaFile: "schema.graphql" }),
    ScheduleModule.forRoot(),
    AccountModule,
    YoutubeModule,
    TwitterModule,
    InstagramModule,
    TiktokModule,
    AdminModule,
    AuthModule,
    // TaskModule,
  ],
  controllers: [],
  providers: [
    DateScalar,
    BigIntScalar,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
