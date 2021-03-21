import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
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
}
