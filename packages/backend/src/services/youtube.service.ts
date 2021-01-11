import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { google, youtube_v3 } from "googleapis";

import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class YoutubeService {
  constructor(
    private accountService: AccountService,
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private configService: ConfigService<EnvironmentVariables>,
    private prisma: PrismaService,
  ) {}

  get youtubeApi() {
    return google.youtube({
      version: "v3",
      auth: this.configService.get("YOUTUBE_API_KEY"),
    });
  }

  async findKeywordsByTitle(titles: string[]) {
    return this.prisma.youtubeKeyword.findMany({
      where: { title: { in: titles } },
    });
  }

  async findTagsByTitle(titles: string[]) {
    return this.prisma.youtubeTag.findMany({
      where: { title: { in: titles } },
    });
  }

  // async saveKeywords(payloads: Prisma.YoutubeKeywordCreateInput[]) {
  //   return payloads.map((payload) =>
  //     this.prisma.youtubeKeyword.upsert({
  //       where: { title: payload.title },
  //       create: payload,
  //       update: payload,
  //     }),
  //   );
  // }

  // async saveTags(payloads: Prisma.YoutubeTagCreateInput[]) {
  //   return payloads.map((payload) =>
  //     this.prisma.youtubeTag.upsert({
  //       where: { title: payload.title },
  //       create: payload,
  //       update: payload,
  //     }),
  //   );
  // }

  async getVideoCategories() {
    const videoResponse = await this.youtubeApi.videoCategories.list({
      part: ["id", "snippet"],
      regionCode: "JP",
      hl: "ja",
    });
    return videoResponse.data.items;
  }

  async saveVideoCategories() {
    const videoCategories = await this.getVideoCategories();

    const values =
      videoCategories?.map((category) => {
        const { id: idString, snippet } = category;
        const title = snippet?.title;
        const assignable = snippet?.assignable;
        if (typeof idString !== "string" || typeof title !== "string" || typeof assignable !== "boolean") {
          throw Error("title or assignable is required");
        }

        const id = Number(idString);
        const data = { id, title, assignable };

        return this.prisma.youtubeVideoCategory.upsert({
          where: { id },
          create: data,
          update: data,
        });
      }) ?? [];

    await this.prisma.$transaction(values);
  }

  async saveAllChannelVideo() {
    const channels = await this.prisma.youtubeChannel.findMany();
    for (const [index, channel] of channels.entries()) {
      console.log(index, channel.id);
      await this.saveChannelPopularVideo(channel.id);
    }
  }

  async saveTrendChannel() {
    const videoIds = await this.crawlService.getTrendVideoIds();

    if (!videoIds) {
      return;
    }

    console.log({ "videoIds.length": videoIds.length });

    let channnelIds: string[] = [];
    for (const chunkVideoIds of this.utilsService.chunk(videoIds, 50)) {
      const videoResponse = await this.youtubeApi.videos.list({
        part: ["id", "snippet", "contentDetails", "statistics", "player"],
        hl: "ja",
        regionCode: "JP",
        id: chunkVideoIds,
      });
      const additionalChannelIds = videoResponse?.data?.items?.map((item) => {
        const channelId = item?.snippet?.channelId;
        if (typeof channelId !== "string") {
          throw Error("channelId is required");
        }
        return channelId;
      });
      channnelIds = channnelIds.concat(additionalChannelIds ?? []);
    }

    console.log({ "channnelIds.length": channnelIds.length });
    await this.saveChannelByChannelIds(channnelIds);
  }

  async saveChannelByChannelIds(channelIds: string[], check = true) {
    const uniqueChannelIds = Array.from(new Set(channelIds));

    let channelItems: youtube_v3.Schema$Channel[] = [];
    for (const chunkChannelIds of this.utilsService.chunk(uniqueChannelIds, 50)) {
      const channelResponse = await this.youtubeApi.channels.list({
        part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
        id: chunkChannelIds,
      });
      channelItems = channelItems.concat(channelResponse.data.items ?? []);
    }

    for (const item of channelItems) {
      const { youtubeChannel, youtubeKeywords } = this.formatChannelData(item);

      if (check) {
        if (youtubeChannel.country !== "JP") {
          continue;
        }
        if ((youtubeChannel.subscriberCount ?? 0) < 10000 && youtubeChannel.viewCount < 1000000) {
          continue;
        }
      }

      console.log(youtubeChannel.id, youtubeChannel.title);

      const existKeywords = await this.findKeywordsByTitle(youtubeKeywords);

      const keywords: Prisma.YoutubeChannelKeywordRelationCreateManyWithoutChannelsInput = {
        connectOrCreate: youtubeKeywords.map((title) => ({
          where: {
            channelId_keywordId: {
              channelId: youtubeChannel.id,
              keywordId: existKeywords.find((exist) => exist.title === title)?.id ?? 0,
            },
          },
          create: {
            keywords: {
              connectOrCreate: {
                where: { title },
                create: { title },
              },
            },
          },
        })),
      };

      const account = await this.accountService.findByYoutubeChannel(youtubeChannel.id);
      const data: Prisma.YoutubeChannelCreateInput = {
        ...youtubeChannel,
        account: {
          connectOrCreate: {
            where: { uuid: account?.uuid ?? "" },
            create: {
              displayName: youtubeChannel.title,
              username: youtubeChannel.id,
              thumbnailUrl: youtubeChannel.thumbnailUrl,
            },
          },
        },
        keywords,
      };

      await this.prisma.youtubeChannel.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    }
  }

  async saveChannelPopularVideo(channelId: string) {
    const videoIds = await this.crawlService.getChannelPopularVideo(channelId);

    const videoResponse = await this.youtubeApi.videos.list({
      part: ["id", "snippet", "contentDetails", "statistics", "player"],
      hl: "ja",
      regionCode: "JP",
      id: videoIds.slice(0, 49),
    });

    const transactionValues = [];
    for (const item of videoResponse.data.items ?? []) {
      const { youtubeVideo, youtubeVideoCategoryId, youtubeTags, youtubeChannelId } = this.formatVideoData(item);
      const existTags = await this.findTagsByTitle(youtubeTags);

      const tags: Prisma.YoutubeVideoTagRelationCreateManyWithoutVideosInput = {
        connectOrCreate: youtubeTags.map((title) => ({
          where: {
            videoId_tagId: {
              videoId: youtubeVideo.id,
              tagId: existTags.find((exist) => exist.title === title)?.id ?? 0,
            },
          },
          create: {
            tags: {
              connectOrCreate: {
                where: { title },
                create: { title },
              },
            },
          },
        })),
      };

      const data: Prisma.YoutubeVideoCreateInput = {
        ...youtubeVideo,
        channel: { connect: { id: youtubeChannelId } },
        videoCategory: { connect: { id: youtubeVideoCategoryId } },
        tags,
      };

      const transaction = this.prisma.youtubeVideo.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
      transactionValues.push(transaction);
    }

    await this.prisma.$transaction(transactionValues);
  }

  async saveChannelVideoCategory() {
    const channels = await this.prisma.youtubeChannel.findMany({
      include: { videos: { select: { videoCategoryId: true } } },
    });

    const transactionValues = [];
    for (const channel of channels) {
      const { id, videos } = channel;

      const videoCategoryIdsObject = videos.reduce((prev, current) => {
        const key = current.videoCategoryId;
        if (!prev[key]) {
          prev[key] = 0;
        }
        prev[key] += 1;
        return prev;
      }, {} as { [key: number]: number });

      for (const [videoCategoryIdString, num] of Object.entries(videoCategoryIdsObject)) {
        const videoCategoryId = Number(videoCategoryIdString);
        const transaction = this.prisma.youtubeChannelVideoCategory.upsert({
          where: {
            channelId_videoCategoryId: {
              channelId: id,
              videoCategoryId,
            },
          },
          create: {
            num,
            channel: { connect: { id } },
            videoCategory: { connect: { id: videoCategoryId } },
          },
          update: {
            num,
          },
        });
        transactionValues.push(transaction);
      }
    }

    await this.prisma.$transaction(transactionValues);
  }

  async getChannelByMainCategory(videoCategoryId: number) {
    const channels = await this.prisma.youtubeChannel.findMany({
      where: {
        channelVideoCategories: {
          some: { videoCategoryId },
        },
      },
      include: {
        channelVideoCategories: {
          orderBy: { num: "desc" },
          take: 1,
        },
      },
    });
    return channels.filter((channel) => channel.channelVideoCategories[0].videoCategoryId === videoCategoryId);
  }

  formatChannelData(item: youtube_v3.Schema$Channel) {
    const { id, snippet, statistics, brandingSettings } = item;
    const keywords = brandingSettings?.channel?.keywords;

    if (typeof id !== "string" || snippet === undefined || statistics === undefined) {
      throw Error("formatChannelData: id,snippet,statistics is required");
    }

    const { title, description, country, thumbnails, publishedAt } = snippet;
    const { videoCount, subscriberCount, viewCount, hiddenSubscriberCount } = statistics;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof publishedAt !== "string" ||
      typeof hiddenSubscriberCount !== "boolean"
    ) {
      throw Error("formatChannelData: title,description,publishedAt,hiddenSubscriberCount is required");
    }

    const keywordArray: string[] = [];
    if (keywords) {
      let tmpKeyword = "";
      for (const keyword of keywords.split(/\s/)) {
        const separator = '"';
        const firstString = keyword.charAt(0);
        const lastString = keyword.slice(-1);
        if (firstString === separator) {
          tmpKeyword = keyword.substr(1);
          continue;
        }
        if (lastString === separator) {
          keywordArray.push(`${tmpKeyword} ${keyword.slice(0, -1)}`);
          tmpKeyword = "";
          continue;
        }
        if (tmpKeyword) {
          tmpKeyword += " " + keyword;
          continue;
        }
        keywordArray.push(keyword);
      }
    }

    const uniqueKeywords = Array.from(new Set(keywordArray));

    const youtubeChannel: Omit<Prisma.YoutubeChannelCreateInput, "account"> = {
      id,
      title,
      description,
      country,
      publishedAt: new Date(publishedAt),
      thumbnailUrl: thumbnails?.medium?.url ?? "",
      subscriberCount: typeof subscriberCount === "string" ? Number(subscriberCount) : null,
      viewCount: Number(viewCount),
      videoCount: Number(videoCount),
      hiddenSubscriberCount,
    };

    return {
      youtubeChannel,
      youtubeKeywords: uniqueKeywords,
    };
  }

  formatVideoData(item: youtube_v3.Schema$Video) {
    const { id, snippet, statistics } = item;

    if (typeof id !== "string" || snippet === undefined || statistics === undefined) {
      throw Error("formatVideoData: id,snippet,statistics is required");
    }

    const { title, description, publishedAt, thumbnails, tags, channelId, categoryId } = snippet;
    const { viewCount, likeCount, dislikeCount, commentCount } = statistics;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof publishedAt !== "string" ||
      typeof categoryId !== "string" ||
      typeof channelId !== "string"
    ) {
      throw Error("formatChannelData: title,description,publishedAt,hiddenSubscriberCount is required");
    }

    const uniqueTags = Array.from(new Set(tags ?? []));
    const youtubeVideo: Omit<Prisma.YoutubeVideoCreateInput, "channel" | "videoCategory"> = {
      id,
      title,
      description,
      thumbnailUrl: thumbnails?.medium?.url ?? "",
      viewCount: Number(viewCount),
      likeCount: typeof likeCount === "string" ? Number(likeCount) : null,
      dislikeCount: typeof dislikeCount === "string" ? Number(dislikeCount) : null,
      commentCount: typeof commentCount === "string" ? Number(commentCount) : null,
      publishedAt: new Date(publishedAt),
    };

    return {
      youtubeVideo,
      youtubeTags: uniqueTags,
      youtubeVideoCategoryId: Number(categoryId),
      youtubeChannelId: channelId,
    };
  }
}
