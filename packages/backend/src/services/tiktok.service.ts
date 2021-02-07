import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

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

  async getRankingPage({ take, page }: { take: number; page: number }) {
    const totalCount = await this.prisma.tiktokUser.count();
    const tiktokUsers = await this.prisma.tiktokUser.findMany({
      take,
      skip: take * (page - 1),
      orderBy: { followerCount: "desc" },
      include: { account: { select: { uuid: true } } },
    });
    return {
      totalPages: Math.ceil(totalCount / take),
      tiktokUsers,
    };
  }

  async upsertUser(_uniqueId: string, _accountId?: string) {
    const result = await this.crawlService.getTiktokUser(_uniqueId);

    if (!result) {
      this.logger.warn("Tiktok user not found");
      return;
    }

    const {
      userInfo: {
        user: {
          id: userId,
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

    const account = await this.prisma.instagramUser.findUnique({ where: { id: userId } }).account();
    const accountId = account?.uuid ?? _accountId;

    const tiktokUser: Prisma.TiktokUserCreateInput = {
      id: userId,
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
        user: { connect: { id: userId } },
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

    if (accountId) {
      await this.prisma.account.update({
        where: { uuid: accountId },
        data: { uuid: accountId },
      });
    }
  }

  async bulkUpdateByUniqueId(baseDataList: { uniqueId: string; accountId: string }[]) {
    for (const [index, { uniqueId, accountId }] of baseDataList.entries()) {
      this.logger.log(`${index} ${uniqueId}`);
      await this.upsertUser(uniqueId, accountId);
    }
  }

  async bulkUpdate(take: number) {
    const beforeDate = dayjs().subtract(1, "day");
    const tiktokUsers = await this.prisma.tiktokUser.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: { account: { select: { uuid: true } } },
      where: { updatedAt: { lte: beforeDate.toDate() } },
    });
    const baseDataList = tiktokUsers.map((user) => ({ uniqueId: user.uniqueId, accountId: user.account.uuid }));
    await this.bulkUpdateByUniqueId(baseDataList);
  }
}
