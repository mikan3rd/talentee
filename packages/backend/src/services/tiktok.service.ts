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
        user: {
          id: useId,
          uniqueId,
          nickname,
          avatarThumb,
          signature,
          bioLink,
          verified,
          secret,
          privateAccount,
          createTime,
        },
        stats: { followerCount, followingCount, heartCount, videoCount },
      },
      items,
    } = result;

    const tiktokUser: Prisma.TiktokUserCreateInput = {
      id: useId,
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
      createdTimestamp: new Date(createTime * 1000),
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

    const tiktokItems = items.map((item) => {
      const {
        id,
        desc,
        createTime,
        stats: { commentCount, diggCount, playCount, shareCount },
      } = item;
      const tiktokItem: Prisma.TiktokItemCreateInput = {
        id,
        desc,
        commentCount,
        diggCount,
        playCount,
        shareCount,
        createdTimestamp: new Date(createTime * 1000),
        user: { connect: { id: useId } },
      };
      return this.prisma.tiktokItem.upsert({
        where: { id },
        create: tiktokItem,
        update: tiktokItem,
      });
    });

    await this.prisma.tiktokUser.upsert({
      where: { id: tiktokUser.id },
      create: tiktokUser,
      update: tiktokUser,
    });

    await this.prisma.$transaction(tiktokItems);
  }

  async bulkUpdate(take: number) {
    const channels = await this.prisma.tiktokUser.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: { account: { select: { uuid: true } } },
    });
    for (const [index, user] of channels.entries()) {
      this.logger.log(`${index} ${user.uniqueId}`);
      await this.upsertUser(user.uniqueId, user.account.uuid);
    }
  }
}
