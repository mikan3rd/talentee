import { Injectable, Logger } from "@nestjs/common";

import { CrawlService } from "@/services/crawl.service";
import { PrismaService } from "@/services/prisma.service";
import { TwitterService } from "@/services/twitter.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

type ServiceNameType =
  | "twitter"
  | "instagram"
  | "nicovideo_channel"
  | "nicovideo_user"
  | "tiktok"
  | "tiktok_vt"
  | "youtube"
  | "other";

type ServiceType = {
  serviceName: ServiceNameType;
  username: string;
  url: string;
};

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private prisma: PrismaService,
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
  ) {}

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

  async addServiceByYoutube(take: number) {
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      include: { account: { select: { uuid: true } } },
      orderBy: { updatedAt: "asc" },
    });
    for (const [index, channel] of youtubeChannels.entries()) {
      this.logger.log(`${index} ${channel.id}`);
      const linkUrls = (await this.crawlService.getServiceLinkByYoutube(channel.id)) ?? [];
      const services = linkUrls
        .map((url) => this.judgeServiceAccount(url))
        .filter((service) => service.serviceName !== "youtube");
      await this.AddServiceByLinkUrls(channel.account.uuid, services);
    }
  }

  async AddServiceByLinkUrls(accoutId: string, services: ServiceType[]) {
    const serviceAccounts = this.groupByServiceName(services);
    for (const serviceAccount of serviceAccounts) {
      const { serviceName, items } = serviceAccount;
      const firstItem = items[0];
      const { username } = firstItem;
      this.logger.log(`${serviceName}: ${username}`);

      if (!username) {
        continue;
      }

      if (serviceName === "youtube") {
        const account = await this.prisma.account.findUnique({
          where: { uuid: accoutId },
          include: { youtubeChannels: true },
        });

        if (!account || account.youtubeChannels.length > 0) {
          continue;
        }

        const youtubeChannel = await this.prisma.youtubeChannel.findUnique({ where: { id: username } });
        if (youtubeChannel) {
          continue;
        }

        await this.youtubeService.saveChannelByChannelIds([username], false);
      }

      if (serviceName === "twitter") {
        const account = await this.prisma.account.findUnique({
          where: { uuid: accoutId },
          include: { twitterUser: true },
        });

        if (!account || account.twitterUser.length > 0) {
          continue;
        }

        const twitterUser = await this.prisma.twitterUser.findUnique({ where: { username } });
        if (twitterUser) {
          continue;
        }

        await this.twitterService.upsertUserByUsername(username, accoutId);
      }
    }
  }

  groupByServiceName(services: ServiceType[]) {
    return this.utilsService
      .groupByObject(services, (service) => service.serviceName)
      .map(([serviceName, items]) => {
        return { serviceName, items: items.map((item, index) => ({ ...item, num: index + 1 })) };
      });
  }

  judgeServiceAccount(url: string) {
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch (e) {
      console.error(e);
      return {
        serviceName: "other" as ServiceNameType,
        username: "",
        url,
      };
    }
    const pathArray = pathname.split("/").reverse();
    let username = pathArray.find((path) => !!path) || "";

    let serviceName: ServiceNameType = "other";
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

    return {
      serviceName,
      username,
      url,
    };
  }
}
