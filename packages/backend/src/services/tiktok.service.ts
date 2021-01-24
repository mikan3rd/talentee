import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);

  constructor(
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private prisma: PrismaService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async upsertUser(uniqueId: string, accountId?: string) {
    await this.crawlService.getTiktokUser(uniqueId);
  }
}
