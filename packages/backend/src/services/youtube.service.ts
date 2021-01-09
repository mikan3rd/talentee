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

  async saveChannel(data: Prisma.YoutubeChannelCreateInput) {
    return this.prisma.youtubeChannel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async saveVideo(data: Prisma.YoutubeVideoCreateInput) {
    return this.prisma.youtubeVideo.upsert({
      where: { id: data.id },
      create: data,
      update: data,
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

  async findKeywords(titles: string[]) {
    return this.prisma.youtubeKeyword.findMany({
      where: { title: { in: titles } },
    });
  }

  async saveTags(payloads: Prisma.YoutubeTagCreateInput[]) {
    return payloads.map((payload) =>
      this.prisma.youtubeTag.upsert({
        where: { title: payload.title },
        create: payload,
        update: payload,
      }),
    );
  }

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

    const values = videoCategories?.map((category) => {
      const { snippet } = category;
      const title = category.snippet?.title;
      const assignable = category.snippet?.assignable;
      if (!title || !assignable) {
        throw Error();
      }

      const id = Number(category.id);
      const data = { id, title, assignable };

      return this.prisma.youtubeVideoCategory.upsert({
        where: { id },
        create: data,
        update: data,
      });
    });

    await this.prisma.$transaction(values ?? []);
  }

  // async saveAllChannelVideo() {
  //   const channels = await this.youtubeChannelModelRepository.find();
  //   for (const channel of channels) {
  //     await this.saveChannelPopularVideo(channel.id);
  //   }
  // }

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
          throw Error("");
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

      const existKeywords = await this.findKeywords(youtubeKeywords.map((keyword) => keyword.title));

      const keywords: Prisma.YoutubeChannelKeywordRelationCreateManyWithoutChannelsInput = {
        connectOrCreate: youtubeKeywords.map((keyword) => ({
          where: {
            channelId_keywordId: {
              channelId: youtubeChannel.id,
              keywordId: existKeywords.find((exist) => exist.title === keyword.title)?.id ?? 0,
            },
          },
          create: {
            keywords: {
              connectOrCreate: {
                where: { title: keyword.title },
                create: { title: keyword.title },
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
      await this.saveChannel(data);
    }
  }

  // async saveChannelPopularVideo(channelId: string) {
  //   const videoIds = await this.crawlService.getChannelPopularVideo(channelId);

  //   const videoResponse = await this.youtubeApi.videos.list({
  //     part: ["id", "snippet", "contentDetails", "statistics", "player"],
  //     hl: "ja",
  //     regionCode: "JP",
  //     id: videoIds.slice(0, 49),
  //   });

  //   const videoCategoryIdsObject: { [key: string]: number } = {};

  //   for (const item of videoResponse.data.items) {
  //     const data = this.formatVideoData(item);

  //     await this.connection.transaction(async (manager) => {
  //       data.tags = await this.saveTags(data.tags, manager);
  //       await this.saveVideo(data, manager);
  //     });

  //     const categoryId = data.videoCategory.id;
  //     if (!videoCategoryIdsObject[categoryId]) {
  //       videoCategoryIdsObject[categoryId] = 0;
  //     }
  //     videoCategoryIdsObject[categoryId] += 1;
  //   }

  //   const videoCategoryIds = Object.entries(videoCategoryIdsObject)
  //     .map(([key, value]) => ({ key, value }))
  //     .sort((a, b) => (a.value > b.value ? -1 : 1))
  //     .map(({ key, value }) => key);

  //   const mainVideoCategoryId = videoCategoryIds[0];
  // }

  formatChannelData(item: youtube_v3.Schema$Channel) {
    const { id, snippet, statistics, brandingSettings } = item;
    const keywords = brandingSettings?.channel?.keywords;

    if (!id || !snippet || !statistics) {
      throw Error("formatChannelData: id,snippet,statistics");
    }

    const { title, description, country, thumbnails, publishedAt } = snippet;
    const { videoCount, subscriberCount, viewCount, hiddenSubscriberCount } = statistics;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof publishedAt !== "string" ||
      typeof hiddenSubscriberCount !== "boolean"
    ) {
      console.log({ title, description, publishedAt, hiddenSubscriberCount });
      throw Error("formatChannelData: some data not found");
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
    const youtubeKeywords: Prisma.YoutubeKeywordCreateInput[] = uniqueKeywords.map((keyword) => ({ title: keyword }));
    return { youtubeChannel, youtubeKeywords };
  }

  // formatVideoData(item: youtube_v3.Schema$Video) {
  //   const { id, snippet, statistics } = item;

  //   if (!id || !snippet || !statistics) {
  //     return;
  //   }

  //   const { title, description, publishedAt, thumbnails, tags, channelId, categoryId } = snippet;
  //   const { viewCount, likeCount, dislikeCount, commentCount } = statistics;

  //   const uniqueTags = Array.from(new Set(tags ?? []));
  //   const data = {
  //     id,
  //     title,
  //     description,
  //     thumbnailUrl: thumbnails?.medium?.url,
  //     viewCount,
  //     likeCount,
  //     dislikeCount,
  //     commentCount,
  //     publishedAt: new Date(publishedAt),
  //     videoCategory: { id: Number(categoryId) },
  //     tags: uniqueTags.map((tag) => ({ title: tag })) ?? [],
  //     channel: { id: channelId },
  //   };
  //   return data;
  // }
}
