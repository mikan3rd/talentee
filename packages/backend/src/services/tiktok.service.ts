import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);

  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async upsertUser(_uniqueId: string, accountId?: string) {
    const result = await this.crawlService.getTiktokUser(_uniqueId);

    if (!result) {
      this.logger.warn("Tiktok user not found");
      return;
    }

    const {
      userInfo: {
        user: { id, uniqueId, nickname, avatarThumb, signature, bioLink, verified, secret, privateAccount, createTime },
        stats: { followerCount, followingCount, heartCount, videoCount },
      },
    } = result;

    const tiktokUser: Prisma.TiktokUserCreateInput = {
      id,
      uniqueId,
      nickname,
      avatarThumb,
      signature,
      bioLink: bioLink?.link ?? null,
      followerCount,
      followingCount,
      heartCount: Number(heartCount),
      videoCount,
      verified,
      privateAccount,
      secret,
      createdTimestamp: new Date(createTime),
      account: {
        connectOrCreate: {
          where: { uuid: accountId ?? "" },
          create: {
            displayName: nickname,
            username: uniqueId,
            thumbnailUrl: avatarThumb,
          },
        },
      },
    };

    await this.prisma.tiktokUser.upsert({
      where: { id: tiktokUser.id },
      create: tiktokUser,
      update: tiktokUser,
    });
  }
}
