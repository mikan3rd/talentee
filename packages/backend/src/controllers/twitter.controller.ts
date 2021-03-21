import { Controller, Logger } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { TwitterService } from "@/services/twitter.service";

@Controller("twitter")
export class TwitterController {
  private readonly logger = new Logger(TwitterController.name);

  constructor(private readonly twitterService: TwitterService, private crawlService: CrawlService) {}
}
