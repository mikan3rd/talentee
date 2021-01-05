import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "@/controllers/app.controller";
import { AccountModule } from "@/modules/account.module";
import { YoutubeModule } from "@/modules/youtube.module";
import { DateScalar } from "@/scalars/date.scalar";
import { AppService } from "@/services/app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        extra: {
          socketPath: configService.get("DB_SOCKET_PATH"),
          charset: "utf8mb4_bin",
        },
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AccountModule,
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateScalar],
})
export class AppModule {}
