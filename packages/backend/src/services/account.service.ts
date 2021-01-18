import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { UtilsService } from "@/services/utils.service";

export type serviceNameType =
  | "twitter"
  | "instagram"
  | "nicovideo_channel"
  | "nicovideo_user"
  | "tiktok"
  | "tiktok_vt"
  | "youtube"
  | "other";
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private prisma: PrismaService, private crawlService: CrawlService, private utilsService: UtilsService) {}

  async findOne(uuid: string) {
    return this.prisma.account.findUnique({ where: { uuid }, include: { youtubeChannels: true } });
  }

  // async findByYoutubeChannelId(id: string) {
  //   return this.accountRepository.findOne({
  //     join: { alias: "account", leftJoinAndSelect: { youtubeChannels: "account.youtubeChannels" } },
  //     where: (qb) => {
  //       qb.where("youtubeChannels.id = :id", { id });
  //     },
  //   });
  // }

  // async findAll() {
  //   return this.accountRepository.find({ relations: ["youtubeChannels"] });
  // }

  async findByYoutubeChannel(id: string) {
    return this.prisma.youtubeChannel
      .findUnique({
        where: { id },
      })
      .account();
  }

  async create(payload: Prisma.AccountCreateInput) {
    return this.prisma.account.create({
      data: payload,
    });
  }

  async addServiceByYoutube(take: number) {
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      orderBy: { updatedAt: "desc" },
    });
    for (const channel of youtubeChannels) {
      this.logger.log(`${channel.id}`);
      const linkUrls = (await this.crawlService.getServiceLinkByYoutube(channel.id)) ?? [];
      this.AddServiceByLinkUrls(linkUrls);
    }
  }

  async AddServiceByLinkUrls(linkUrls: string[]) {
    const serviceAccounts = this.bulkJudgeServiceAccount(linkUrls);
    for (const serviceAccount of serviceAccounts) {
      const { serviceName, items } = serviceAccount;
      const firstItem = items[0];
      const { username } = firstItem;
      this.logger.log(`${serviceName}: ${username}`);
    }
  }

  bulkJudgeServiceAccount(urls: string[]) {
    const accounts = urls.map((url) => this.judgeServiceAccount(url));
    const result = this.utilsService
      .groupByObject(accounts, (account) => account.serviceName)
      .map(([serviceName, items]) => {
        return { serviceName, items: items.map((item, index) => ({ ...item, num: index + 1 })) };
      });
    return result;
  }

  judgeServiceAccount(url: string) {
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch (e) {
      console.error(e);
      return {
        serviceName: "other" as serviceNameType,
        username: "",
        url,
      };
    }
    const pathArray = pathname.split("/").reverse();
    let username = pathArray.find((path) => !!path) || "";

    let serviceName: serviceNameType = "other";
    if (/twitter.com/.test(url)) {
      serviceName = "twitter" as const;
      username = username.replace("@", "");
    } else if (/instagram.com/.test(url)) {
      serviceName = "instagram" as const;
    } else if (/ch.nicovideo.jp/.test(url)) {
      serviceName = "nicovideo_channel" as const;
    } else if (/nicovideo.jp/.test(url)) {
      serviceName = "nicovideo_user" as const;
    } else if (/v?t.tiktok.com/.test(url)) {
      serviceName = "tiktok_vt" as const;
      username = username.replace("@", "");
    } else if (/tiktok.com/.test(url)) {
      serviceName = "tiktok" as const;
      username = username.replace("@", "");
    } else if (/youtube.com/.test(url)) {
      serviceName = "youtube" as const;
    }

    const result = {
      serviceName,
      username,
      url,
    };
    return result;
  }
}
