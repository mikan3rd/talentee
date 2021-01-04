import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { google, youtube_v3 } from "googleapis";
import { Connection, DeepPartial, In, Repository } from "typeorm";

import { AccountModel } from "@/models/account.model";
import { YoutubeChannelModel } from "@/models/youtubeChannel.model";
import { YoutubeKeywordModel } from "@/models/youtubeKeyword.model";
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
    @InjectRepository(YoutubeKeywordModel)
    private youtubeKeywordRepository: Repository<YoutubeKeywordModel>,
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

  async saveChannel(payload: DeepPartial<YoutubeChannelModel>) {
    return this.youtubeChannelModelRepository.save(payload);
  }

  async saveKeywords(payloads: DeepPartial<YoutubeKeywordModel>[]) {
    const keywordTitles = payloads.map((payload) => payload.title);
    const existKeywords = await this.getKeywordsByTitle(keywordTitles);
    const existKeywordTitles = existKeywords.map((keyword) => keyword.title);
    const notExistKeywords = keywordTitles
      .filter((title) => !existKeywordTitles.includes(title))
      .map((title) => ({ title }));
    await this.youtubeKeywordRepository.insert(notExistKeywords);
    return await this.getKeywordsByTitle(keywordTitles);
  }

  async getKeywordsByTitle(keywordTitles: string[]) {
    return this.youtubeKeywordRepository.find({
      where: { title: In(keywordTitles) },
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

      console.log(data);

      data.keywords = await this.saveKeywords(data.keywords);

      let account = await this.accountService.findByYoutubeChannelId(data.id);
      if (!account) {
        const accountData: DeepPartial<AccountModel> = {
          displayName: data.title,
          username: data.id,
          thumbnailUrl: data.thumbnailUrl,
        };
        account = await this.accountService.save(accountData);
      }

      data.account = account;
      await this.saveChannel(data);
    }
  }

  async formatChannelData(item: youtube_v3.Schema$Channel): Promise<DeepPartial<YoutubeChannelModel>> {
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
      videoCount: Number(videoCount),
      hiddenSubscriberCount,
      keywords: uniqueKeywords.map((keyword) => ({ title: keyword })),
    };
    return data;
  }
}
