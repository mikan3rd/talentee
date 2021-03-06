import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

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

  async getRankingPage({ take, page }: { take: number; page: number }) {
    const totalCount = await this.prisma.instagramUser.count();
    const instagramUsers = await this.prisma.instagramUser.findMany({
      take,
      skip: take * (page - 1),
      orderBy: { followedBy: "desc" },
      include: {
        account: {
          include: {
            youtubeChannels: { select: { id: true } },
            twitterUsers: { select: { username: true } },
            instagramUsers: { select: { username: true } },
            tiktokUsers: { select: { uniqueId: true } },
          },
        },
      },
    });
    return {
      totalPages: Math.ceil(totalCount / take),
      instagramUsers,
    };
  }

  async upsertUsers(baseDataList: { username: string; accountId?: string }[]) {
    if (!baseDataList.length) {
      return;
    }

    const baseDataMapping = baseDataList.reduce((prev, { username, accountId }) => {
      prev[username] = { accountId, username };
      return prev;
    }, {} as { [username: string]: { username: string; accountId?: string } });

    const usernmes = Object.values(baseDataMapping).map(({ username }) => username);
    const results = await this.crawlService.crawlInstagramProfile(usernmes);

    if (!Array.isArray(results)) {
      return results;
    }

    this.logger.debug(`results: ${results.length}`);

    if (!results.length) {
      return;
    }

    for (const [index, result] of results.entries()) {
      const { userData, mediaData } = result;

      const {
        id: ownerId,
        username,
        follow,
        followed_by,
        full_name,
        biography,
        external_url,
        profile_pic_url,
        is_private,
        is_verified,
        mediaCount,
      } = userData;

      this.logger.debug(`${index} ${username}`);

      const target = baseDataMapping[username];
      const account = await this.prisma.instagramUser.findUnique({ where: { id: ownerId } }).account();

      const accountId = account?.uuid ?? target.accountId;
      const instagramUser: Prisma.InstagramUserCreateInput = {
        id: ownerId,
        username,
        fullName: full_name,
        follow,
        followedBy: followed_by,
        biography,
        externalUrl: external_url,
        isPrivate: is_private,
        isVerified: is_verified,
        profilePicUrl: profile_pic_url,
        mediaCount,
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

      const instagramMedias = mediaData.map((media) => {
        const {
          id,
          shortcode,
          thumbnail_src,
          taken_at_timestamp,
          is_video,
          liked_by,
          display_url,
          media_to_caption,
          media_preview_like,
          media_to_comment,
          video_view_count,
          product_type,
          location,
        } = media;
        const instagramMedia: Prisma.InstagramMediaCreateInput = {
          id,
          shortcode,
          thumbnailSrc: thumbnail_src,
          displayUrl: display_url,
          likedBy: liked_by,
          mediaPreviewLike: media_preview_like,
          mediaToCaption: media_to_caption[0] ?? "",
          mediaToComment: media_to_comment,
          videoViewCount: video_view_count,
          productType: product_type,
          takenAtTimestamp: new Date(taken_at_timestamp * 1000),
          isVideo: is_video,
          user: { connect: { id: ownerId } },
          location: !location
            ? undefined
            : {
                connectOrCreate: {
                  where: { id: location.id },
                  create: {
                    id: location.id,
                    name: location.name,
                    slug: location.slug,
                    hasPublicPage: location.has_public_page,
                  },
                },
              },
        };
        return this.prisma.instagramMedia.upsert({
          where: { id },
          create: instagramMedia,
          update: instagramMedia,
        });
      });

      await this.prisma.instagramUser.upsert({
        where: { id: instagramUser.id },
        create: instagramUser,
        update: instagramUser,
      });

      await this.prisma.$transaction(instagramMedias);

      if (accountId) {
        await this.prisma.account.update({
          where: { uuid: accountId },
          data: { uuid: accountId },
        });
      }
    }
  }

  async bulkUpdate(take: number) {
    const beforeDate = dayjs().subtract(1, "day");
    const users = await this.prisma.instagramUser.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: { account: { select: { uuid: true } } },
      where: { updatedAt: { lte: beforeDate.toDate() } },
    });

    this.logger.debug(`users: ${users.length}`);
    if (!users.length) {
      return;
    }

    const baseDataList = users.map(({ account, username }) => ({ username, accountId: account.uuid }));
    await this.upsertUsers(baseDataList);
  }
}
