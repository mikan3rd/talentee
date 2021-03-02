import { Body, Controller, Get, Logger, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";

import { CrawlService } from "@/services/crawl.service";
import { InstagramService } from "@/services/instagram.service";

@Controller("instagram")
export class InstagramController {
  private readonly logger = new Logger(InstagramController.name);

  constructor(private readonly instagramService: InstagramService, private crawlService: CrawlService) {}

  @Get("/crawlInstagramProfile")
  async crawlInstagramProfile(@Res() res: Response, @Query("username") username?: string) {
    this.logger.log(username);
    if (!username) {
      return res.send("FAILED!!");
    }
    const results = await this.crawlService.crawlInstagramProfile([username]);
    if (!Array.isArray(results)) {
      res.contentType("image/jpeg");
      return res.send(results);
    }
    return res.send("SUCCESS!!");
  }

  @Post("/addAccount")
  async addAccount(@Res() res: Response, @Body("username") username?: string) {
    this.logger.log(`username: ${username}`);
    if (!username) {
      return res.send("FAILED!!");
    }
    await this.instagramService.upsertUsers([{ username }]);

    return res.send("SUCCESS!!");
  }
}
