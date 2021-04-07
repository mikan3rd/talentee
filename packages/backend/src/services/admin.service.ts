import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { InstagramService } from "@/services/instagram.service";
import { PrismaService } from "@/services/prisma.service";
import { TiktokService } from "@/services/tiktok.service";
import { TwitterService } from "@/services/twitter.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
    private instagramService: InstagramService,
    private tiktokService: TiktokService,
  ) {}

  async findAccountByUsername({
    youtubeChannelId,
    twitterUsername,
    instagramUsername,
    tiktokUniqueId,
  }: {
    youtubeChannelId?: string;
    twitterUsername?: string;
    instagramUsername?: string;
    tiktokUniqueId?: string;
  }) {
    if (!youtubeChannelId && !twitterUsername && !instagramUsername && !tiktokUniqueId) {
      throw Error("At least one username is required");
    }

    let where: Prisma.AccountWhereInput = {};

    if (youtubeChannelId) {
      where = { youtubeChannels: { some: { id: youtubeChannelId } } };
    } else if (twitterUsername) {
      where = { twitterUsers: { some: { username: twitterUsername } } };
    } else if (instagramUsername) {
      where = { instagramUsers: { some: { username: instagramUsername } } };
    } else if (tiktokUniqueId) {
      where = { tiktokUsers: { some: { uniqueId: tiktokUniqueId } } };
    }

    return this.prisma.account.findFirst({
      where,
      include: {
        youtubeChannels: { select: { id: true } },
        twitterUsers: { select: { username: true } },
        instagramUsers: { select: { username: true } },
        tiktokUsers: { select: { uniqueId: true } },
      },
    });
  }

  async addAccountByUsername({
    youtubeChannelId,
    twitterUsername,
    instagramUsername,
    tiktokUniqueId,
  }: {
    youtubeChannelId?: string;
    twitterUsername?: string;
    instagramUsername?: string;
    tiktokUniqueId?: string;
  }) {
    if (!youtubeChannelId && !twitterUsername && !instagramUsername && !tiktokUniqueId) {
      throw Error("At least one username is required");
    }

    const include: Prisma.AccountInclude = {
      youtubeChannels: { select: { id: true } },
      twitterUsers: { select: { username: true } },
      instagramUsers: { select: { username: true } },
      tiktokUsers: { select: { uniqueId: true } },
    };

    if (youtubeChannelId) {
      await this.youtubeService.bulkUpsertChannelByChannelId([{ channelId: youtubeChannelId }]);
      return this.prisma.account.findFirst({
        where: { youtubeChannels: { some: { id: youtubeChannelId } } },
        include,
      });
    } else if (twitterUsername) {
      await this.twitterService.upsertUsersByUsername([{ username: twitterUsername }]);
      return this.prisma.account.findFirst({
        where: { twitterUsers: { some: { username: twitterUsername } } },
        include,
      });
    } else if (instagramUsername) {
      await this.instagramService.upsertUsers([{ username: instagramUsername }]);
      return this.prisma.account.findFirst({
        where: { instagramUsers: { some: { username: instagramUsername } } },
        include,
      });
    } else if (tiktokUniqueId) {
      await this.tiktokService.bulkUpdateByUniqueId([{ uniqueId: tiktokUniqueId }]);
      return this.prisma.account.findFirst({
        where: { tiktokUsers: { some: { uniqueId: tiktokUniqueId } } },
        include,
      });
    }

    throw Error("Unhandled condition");
  }

  async searchAccount({ word, take }: { word: string; take: number }) {
    const where: Prisma.AccountWhereInput = {
      OR: [
        { youtubeChannels: { some: { title: { contains: word } } } },
        { twitterUsers: { some: { name: { contains: word } } } },
        { instagramUsers: { some: { fullName: { contains: word } } } },
        { tiktokUsers: { some: { nickname: { contains: word } } } },
      ],
    };
    const accounts = this.prisma.account.findMany({
      take,
      where,
      include: {
        youtubeChannels: { select: { id: true, title: true } },
        twitterUsers: { select: { username: true, name: true } },
        instagramUsers: { select: { username: true, fullName: true } },
        tiktokUsers: { select: { uniqueId: true, nickname: true } },
      },
    });
    return accounts;
  }

  async updateAccount({ uuid, displayName }: { uuid: string; displayName: string }) {
    return await this.prisma.account.update({ where: { uuid }, data: { displayName } });
  }
}
