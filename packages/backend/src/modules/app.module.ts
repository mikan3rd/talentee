import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { AppController } from "@/controllers/app.controller";
import { AccountModule } from "@/modules/account.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { BigIntScalar } from "@/scalars/bigint.scalar";
import { DateScalar } from "@/scalars/date.scalar";
import { AppService } from "@/services/app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({ autoSchemaFile: "schema.graphql" }),
    AccountModule,
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateScalar, BigIntScalar],
})
export class AppModule {}
