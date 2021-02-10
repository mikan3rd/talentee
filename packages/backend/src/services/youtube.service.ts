import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { google, youtube_v3 } from "googleapis";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  constructor(
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

  async getRankingPage({
    take,
    page,
    videoCategoryId,
    isAll,
  }: {
    take: number;
    page: number;
    videoCategoryId?: number;
    isAll?: boolean;
  }) {
    const where: Prisma.YoutubeChannelWhereInput | undefined =
      isAll === true ? undefined : { mainVideoCategoryId: videoCategoryId };
    const totalCount = await this.prisma.youtubeChannel.count({ where });
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      skip: take * (page - 1),
      orderBy: { subscriberCount: "desc" },
      where,
      include: {
        keywords: { include: { keyword: true }, orderBy: { keyword: { num: "desc" } } },
        channelVideoCategories: { orderBy: { num: "desc" }, include: { videoCategory: true } },
      },
    });
    const youtubeVideoCategories = await this.prisma.youtubeVideoCategory.findMany({
      where: { assignable: true },
      orderBy: { id: "asc" },
    });
    return {
      totalPages: Math.ceil(totalCount / take),
      youtubeChannels,
      youtubeVideoCategories,
    };
  }

  async getChannelList(channelIds: string[]) {
    return await this.youtubeApi.channels.list({
      part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
      id: channelIds,
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

  async getVideoCategories() {
    const videoResponse = await this.youtubeApi.videoCategories.list({
      part: ["id", "snippet"],
      regionCode: "US", // JPだと非営利団体と社会活動カテゴリが取得できないため
      hl: "ja",
    });
    return videoResponse.data.items;
  }

  async bulkUpdateVideoCategory() {
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

  async saveTrendChannel() {
    const videoIds = (await this.crawlService.getTrendVideoIds()) ?? [];

    this.logger.log(`videoIds.length: ${videoIds.length}`);

    let channelIds: string[] = [];
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
      channelIds = channelIds.concat(additionalChannelIds ?? []);
    }

    const uniqueChannelIds = Array.from(new Set(channelIds));
    const existChannelIds = (
      await this.prisma.youtubeChannel.findMany({
        where: { id: { in: Array.from(uniqueChannelIds) } },
        select: { id: true },
      })
    ).map(({ id }) => id);
    const filteredChannelIds = uniqueChannelIds.filter((channelId) => !existChannelIds.includes(channelId));
    this.logger.log(
      `uniqueChannelIds: ${uniqueChannelIds.length}, existChannelIds: ${existChannelIds.length}, filteredChannelIds: ${filteredChannelIds.length}`,
    );

    const baseDataList = filteredChannelIds.map((channelId) => ({ channelId }));
    await this.bulkUpsertChannelByChannelId(baseDataList);
  }

  async bulkUpsertChannelByChannelId(baseDataList: { channelId: string; accountId?: string }[], check = true) {
    const baseDataMapping = baseDataList.reduce((prev, { channelId, accountId }) => {
      prev[channelId] = { accountId, channelId };
      return prev;
    }, {} as { [channelId: string]: { channelId: string; accountId?: string } });

    let channelItems: youtube_v3.Schema$Channel[] = [];
    const channelIds = Object.values(baseDataMapping).map(({ channelId }) => channelId);
    for (const chunkChannelIds of this.utilsService.chunk(channelIds, 50)) {
      const channelResponse = await this.getChannelList(chunkChannelIds);
      channelItems = channelItems.concat(channelResponse.data.items ?? []);
    }

    let channelDataList = channelItems.map((item) => this.formatChannelData(item));

    if (check) {
      channelDataList = channelDataList.filter(
        ({ youtubeChannel }) =>
          youtubeChannel.country === "JP" &&
          (youtubeChannel.subscriberCount ?? 0) >= 10000 &&
          youtubeChannel.viewCount >= 1000000,
      );
    }

    this.logger.log(`channelDataList: ${channelDataList.length}`);

    for (const [index, { youtubeChannel, youtubeKeywords }] of channelDataList.entries()) {
      const target = baseDataMapping[youtubeChannel.id];
      this.logger.log(`${index} ${youtubeChannel.id} ${target.accountId}`);
      await this.upsertChannel(youtubeChannel, youtubeKeywords, target.accountId);
      await this.saveChannelPopularVideo(youtubeChannel.id);
    }
  }

  async upsertChannel(youtubeChannel: YoutubeChannelFormatData, youtubeKeywords: string[], _accountId?: string) {
    const existKeywords = await this.findKeywordsByTitle(youtubeKeywords);

    const keywords: Prisma.YoutubeChannelKeywordRelationCreateNestedManyWithoutChannelInput = {
      connectOrCreate: youtubeKeywords.map((title) => ({
        where: {
          channelId_keywordId: {
            channelId: youtubeChannel.id,
            keywordId: existKeywords.find((exist) => exist.title === title)?.id ?? 0,
          },
        },
        create: {
          keyword: {
            connectOrCreate: {
              where: { title },
              create: { title },
            },
          },
        },
      })),
    };

    const account = await this.prisma.youtubeChannel.findUnique({ where: { id: youtubeChannel.id } }).account();
    const accountId = account?.uuid ?? _accountId;

    const data: Prisma.YoutubeChannelCreateInput = {
      ...youtubeChannel,
      account: {
        connectOrCreate: {
          where: { uuid: accountId ?? "" },
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

    if (accountId) {
      await this.prisma.account.update({
        where: { uuid: accountId },
        data: { uuid: accountId },
      });
    }
  }

  async saveChannelPopularVideo(channelId: string) {
    const videoIds = await this.crawlService.getChannelPopularVideo(channelId);

    if (!videoIds.length) {
      return;
    }

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

      const tags: Prisma.YoutubeVideoTagRelationCreateNestedManyWithoutVideoInput = {
        connectOrCreate: youtubeTags.map((title) => ({
          where: {
            videoId_tagId: {
              videoId: youtubeVideo.id,
              tagId: existTags.find((exist) => exist.title === title)?.id ?? 0,
            },
          },
          create: {
            tag: {
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

  async bulkUpdateChannelVideoCategory() {
    const channels = await this.prisma.youtubeChannel.findMany({
      include: { videos: { select: { videoCategoryId: true } } },
    });

    const transactionValues = [];
    const channelTransactionValues = [];
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

      const videoCategories = Object.entries(videoCategoryIdsObject)
        .map(([videoCategoryIdString, num]) => ({
          videoCategoryId: Number(videoCategoryIdString),
          num,
        }))
        .sort((a, b) => (a.num > b.num ? -1 : 1));

      if (!videoCategories.length) {
        continue;
      }

      for (const { videoCategoryId, num } of videoCategories) {
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

      const channelTransaction = this.prisma.youtubeChannel.update({
        where: { id },
        data: { mainVideoCategoryId: videoCategories[0].videoCategoryId },
      });
      channelTransactionValues.push(channelTransaction);
    }

    await this.prisma.$transaction(transactionValues);
    await this.prisma.$transaction(channelTransactionValues);
  }

  async bulkUpdateChannelKeyword() {
    const keywords = await this.prisma.youtubeKeyword.findMany({
      include: { channels: { select: { channelId: true } } },
    });
    const transactionValues = keywords.map(({ id, channels }) => {
      const num = channels.length;
      return this.prisma.youtubeKeyword.update({ where: { id }, data: { num } });
    });
    await this.prisma.$transaction(transactionValues);
  }

  async bulkUpdateVideoTag() {
    const tags = await this.prisma.youtubeTag.findMany({
      include: { videos: { select: { videoId: true } } },
    });
    const transactionValues = tags.map(({ id, videos }) => {
      const num = videos.length;
      return this.prisma.youtubeTag.update({ where: { id }, data: { num } });
    });
    await this.prisma.$transaction(transactionValues);
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

    const uniqueKeywords = Array.from(new Set(keywordArray.map((keyword) => keyword.replace("\b", ""))));

    const youtubeChannel: YoutubeChannelFormatData = {
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

    const uniqueTags = Array.from(new Set(tags?.map((tag) => tag.replace("\b", "")) ?? []));
    const youtubeVideo: Omit<Prisma.YoutubeVideoCreateInput, "channel" | "videoCategory"> = {
      id,
      title,
      description,
      thumbnailUrl: thumbnails?.medium?.url ?? "",
      viewCount: typeof viewCount === "string" ? Number(viewCount) : null,
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

type YoutubeChannelFormatData = Omit<Prisma.YoutubeChannelCreateInput, "account">;
