import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async upsertUser(username: string) {
    const result = await this.crawlService.crawlInstagramProfile(username);
    if (!result) {
      return;
    }
    const { userData, mediaData } = result;
  }
}
