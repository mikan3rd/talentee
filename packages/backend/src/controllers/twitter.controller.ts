import { Body, Controller, Logger, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { CrawlService } from "@/services/crawl.service";
import { TwitterService } from "@/services/twitter.service";

@Controller("twitter")
export class TwitterController {
  private readonly logger = new Logger(TwitterController.name);

  constructor(private readonly twitterServoce: TwitterService, private crawlService: CrawlService) {}

  @Post("/addAccount")
  async addAccount(@Res() res: Response, @Body("username") username?: string) {
    this.logger.log(`username: ${username}`);
    if (!username) {
      return res.send("FAILED!!");
    }
    await this.twitterServoce.upsertUsersByUsername([{ username }]);

    return res.send("SUCCESS!!");
  }
}
