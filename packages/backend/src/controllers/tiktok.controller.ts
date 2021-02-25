import { Controller, Logger, Post } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { TiktokService } from "@/services/tiktok.service";

@Controller("tiktok")
export class TiktokController {
  private readonly logger = new Logger(TiktokController.name);

  constructor(private readonly tiktokService: TiktokService, private crawlService: CrawlService) {}

  @Post("/saveTrendUser")
  async saveTrendUser() {
    const uniqueIds = await this.crawlService.getTiktokTrend();
    const baseDataList = uniqueIds.map((uniqueId) => ({ uniqueId }));
    await this.tiktokService.bulkUpdateByUniqueId(baseDataList);
    return uniqueIds;
  }
}
