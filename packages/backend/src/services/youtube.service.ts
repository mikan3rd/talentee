import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { google } from "googleapis";
import { Repository } from "typeorm";

import { CrawlService } from "@/services/crawl.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class YoutubeService {
  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  get youtubeService() {
    return google.youtube({ version: "v3", auth: this.configService.get("YOUTUBE_API_KEY") });
  }

  async saveTrendChannel() {
    const videoIds = await this.crawlService.getTrendVideoIds();
    console.log({ "videoIds.length": videoIds.length });

    let channnelIds: string[] = [];
    for (const chunkVideoIds of this.utilsService.chunk(videoIds, 50)) {
      const videoResponse = await this.youtubeService.videos.list({
        part: ["id", "snippet", "contentDetails", "statistics", "player"],
        hl: "ja",
        regionCode: "JP",
        id: chunkVideoIds,
      });
      channnelIds = channnelIds.concat(videoResponse.data.items.map((item) => item.snippet.channelId));
    }

    console.log({ "channnelIds.length": channnelIds.length });
    // TODO
    // await saveChannel(channnelIds);
  }
}
