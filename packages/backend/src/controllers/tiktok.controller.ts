import { Controller, Get, Logger } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { TiktokService } from "@/services/tiktok.service";

@Controller("tiktok")
export class TiktokController {
  private readonly logger = new Logger(TiktokController.name);

  constructor(private readonly tiktokService: TiktokService, private crawlService: CrawlService) {}

  @Get("/getTiktokTrend")
  async getTiktokTrend() {
    const uniqueIds = await this.crawlService.getTiktokTrend();
    return uniqueIds;
  }
}
