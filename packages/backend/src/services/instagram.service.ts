import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async upsertUser(_username: string, accountId?: string) {
    let result;

    try {
      result = await this.crawlService.crawlInstagramProfile(_username);
    } catch (e) {
      this.logger.error(e);
    }

    if (!result) {
      this.logger.warn("Instagram user not found");
      return;
    }
    const { userData, mediaData } = result;

    const {
      id,
      username,
      follow,
      followed_by,
      full_name,
      biography,
      external_url,
      profile_pic_url,
      is_private,
      is_verified,
    } = userData;

    const instagramUser: Prisma.InstagramUserCreateInput = {
      id,
      username,
      fullName: full_name,
      follow,
      followedBy: followed_by,
      biography,
      externalUrl: external_url,
      isPrivate: is_private,
      isVerified: is_verified,
      profilePicUrl: profile_pic_url,
      account: {
        connectOrCreate: {
          where: { uuid: accountId ?? "" },
          create: {
            displayName: full_name,
            username,
            thumbnailUrl: profile_pic_url,
          },
        },
      },
    };

    await this.prisma.instagramUser.upsert({
      where: { id: instagramUser.id },
      create: instagramUser,
      update: instagramUser,
    });
  }
}
