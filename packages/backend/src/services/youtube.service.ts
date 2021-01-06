import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { google, youtube_v3 } from "googleapis";
import { Connection, DeepPartial, EntityManager, In, Repository } from "typeorm";

import { AccountModel } from "@/models/account.model";
import { YoutubeChannelModel } from "@/models/youtubeChannel.model";
import { YoutubeKeywordModel } from "@/models/youtubeKeyword.model";
import { YoutubeTagModel } from "@/models/youtubeTag.model";
import { YoutubeVideoModel } from "@/models/youtubeVideo.model";
import { YoutubeVideoCategoryModel } from "@/models/youtubeVideoCategoriy.model";
import { AccountService } from "@/services/account.service";
import { CrawlService } from "@/services/crawl.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class YoutubeService {
  constructor(
    private connection: Connection,
    @InjectRepository(YoutubeChannelModel)
    private youtubeChannelModelRepository: Repository<YoutubeChannelModel>,
    @InjectRepository(YoutubeVideoCategoryModel)
    private youtubeVideoCategoryRepository: Repository<YoutubeVideoCategoryModel>,
    private accountService: AccountService,
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  get youtubeApi() {
    return google.youtube({ version: "v3", auth: this.configService.get("YOUTUBE_API_KEY") });
  }

  async saveChannel(payload: DeepPartial<YoutubeChannelModel>, manager: EntityManager) {
    return manager.getRepository(YoutubeChannelModel).save(payload);
  }

  async saveVideo(payload: DeepPartial<YoutubeVideoModel>, manager: EntityManager) {
    return manager.getRepository(YoutubeVideoModel).save(payload);
  }

  async saveKeywords(payloads: DeepPartial<YoutubeKeywordModel>[], manager: EntityManager) {
    const keywordTitles = payloads.map((payload) => payload.title);
    const existKeywords = await this.getKeywordsByTitle(keywordTitles, manager);
    const existKeywordTitles = existKeywords.map((keyword) => keyword.title);
    const notExistKeywords = keywordTitles
      .filter((title) => !existKeywordTitles.includes(title))
      .map((title) => ({ title }));
    await manager.getRepository(YoutubeKeywordModel).insert(notExistKeywords);
    return await this.getKeywordsByTitle(keywordTitles, manager);
  }

  async getKeywordsByTitle(keywordTitles: string[], manager: EntityManager) {
    return manager.getRepository(YoutubeKeywordModel).find({
      where: { title: In(keywordTitles) },
    });
  }

  async saveTags(payloads: DeepPartial<YoutubeTagModel>[], manager: EntityManager) {
    const titles = payloads.map((payload) => payload.title);
    const existTags = await this.getTagsByTitle(titles, manager);
    const existTagTitles = existTags.map((tag) => tag.title);
    const notExistKeywords = titles.filter((title) => !existTagTitles.includes(title)).map((title) => ({ title }));
    await manager.getRepository(YoutubeTagModel).insert(notExistKeywords);
    return await this.getTagsByTitle(titles, manager);
  }

  async getTagsByTitle(titles: string[], manager: EntityManager) {
    return manager.getRepository(YoutubeTagModel).find({
      where: { title: In(titles) },
    });
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
    const videoCategoryEntities = videoCategories.map(({ id, snippet: { title, assignable } }) => ({
      id: Number(id),
      title,
      assignable,
    }));
    await this.youtubeVideoCategoryRepository.save(videoCategoryEntities);
  }

  async saveAllChannelVideo() {
    const channels = await this.youtubeChannelModelRepository.find();
    for (const channel of channels) {
      await this.saveChannelPopularVideo(channel.id);
    }
  }

  async saveTrendChannel() {
    const videoIds = await this.crawlService.getTrendVideoIds();
    console.log({ "videoIds.length": videoIds.length });

    let channnelIds: string[] = [];
    for (const chunkVideoIds of this.utilsService.chunk(videoIds, 50)) {
      const videoResponse = await this.youtubeApi.videos.list({
        part: ["id", "snippet", "contentDetails", "statistics", "player"],
        hl: "ja",
        regionCode: "JP",
        id: chunkVideoIds,
      });
      channnelIds = channnelIds.concat(videoResponse.data.items.map((item) => item.snippet.channelId));
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
      channelItems = channelItems.concat(channelResponse.data.items);
    }

    for (const item of channelItems) {
      const data = await this.formatChannelData(item);

      if (check) {
        if (data.country !== "JP") {
          continue;
        }
        if (Number(data.subscriberCount) < 10000 && Number(data.viewCount) < 1000000) {
          continue;
        }
      }

      console.log(data.id, data.title);

      await this.connection.transaction(async (manager) => {
        data.keywords = await this.saveKeywords(data.keywords, manager);

        let account = await this.accountService.findByYoutubeChannelId(data.id);
        if (!account) {
          const accountData: DeepPartial<AccountModel> = {
            displayName: data.title,
            username: data.id,
            thumbnailUrl: data.thumbnailUrl,
          };
          account = await this.accountService.save(accountData, manager);
        }

        data.account = account;
        await this.saveChannel(data, manager);
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

    const videoCategoryIdsObject: { [key: string]: number } = {};

    for (const item of videoResponse.data.items) {
      const data = this.formatVideoData(item);

      await this.connection.transaction(async (manager) => {
        data.tags = await this.saveTags(data.tags, manager);
        await this.saveVideo(data, manager);
      });

      const categoryId = data.videoCategory.id;
      if (!videoCategoryIdsObject[categoryId]) {
        videoCategoryIdsObject[categoryId] = 0;
      }
      videoCategoryIdsObject[categoryId] += 1;
    }

    const videoCategoryIds = Object.entries(videoCategoryIdsObject)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => (a.value > b.value ? -1 : 1))
      .map(({ key, value }) => key);

    const mainVideoCategoryId = videoCategoryIds[0];
  }

  async formatChannelData(item: youtube_v3.Schema$Channel) {
    const {
      id,
      snippet: { title, description, country, thumbnails, publishedAt },
      statistics: { videoCount, subscriberCount, viewCount, hiddenSubscriberCount },
      brandingSettings: {
        channel: { keywords },
      },
    } = item;

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

    const data: DeepPartial<YoutubeChannelModel> = {
      id,
      title,
      description,
      country,
      publishedAt: new Date(publishedAt),
      thumbnailUrl: thumbnails.medium.url,
      subscriberCount: subscriberCount,
      viewCount: viewCount,
      videoCount: videoCount,
      hiddenSubscriberCount,
      keywords: uniqueKeywords.map((keyword) => ({ title: keyword })),
    };
    return data;
  }

  formatVideoData(item: youtube_v3.Schema$Video) {
    const {
      id,
      snippet: { title, description, publishedAt, thumbnails, tags, channelId, categoryId },
      statistics: { viewCount, likeCount, dislikeCount, commentCount },
    } = item;
    const uniqueTags = Array.from(new Set(tags ?? []));
    const data: DeepPartial<YoutubeVideoModel> = {
      id,
      title,
      description,
      thumbnailUrl: thumbnails.medium.url,
      viewCount,
      likeCount,
      dislikeCount,
      commentCount,
      publishedAt: new Date(publishedAt),
      videoCategory: { id: Number(categoryId) },
      tags: uniqueTags.map((tag) => ({ title: tag })) ?? [],
      channel: { id: channelId },
    };
    return data;
  }
}
