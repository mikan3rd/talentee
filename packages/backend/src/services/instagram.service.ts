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
    } = userData;

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
  }

  async bulkUpdate(take: number) {
    const beforeDate = dayjs().subtract(1, "day");
    const channels = await this.prisma.instagramUser.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: { account: { select: { uuid: true } } },
      where: { updatedAt: { lte: beforeDate.toDate() } },
    });
    for (const [index, user] of channels.entries()) {
      this.logger.log(`${index} ${user.username}`);
      await this.upsertUser(user.username, user.account.uuid);
    }
  }
}
