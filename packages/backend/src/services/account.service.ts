import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";

import { CrawlService } from "@/services/crawl.service";
import { InstagramService } from "@/services/instagram.service";
import { PrismaService } from "@/services/prisma.service";
import { TiktokService } from "@/services/tiktok.service";
import { TwitterService } from "@/services/twitter.service";
import { UtilsService } from "@/services/utils.service";
import { YoutubeService } from "@/services/youtube.service";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private prisma: PrismaService,
    private crawlService: CrawlService,
    private utilsService: UtilsService,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
    private instagramService: InstagramService,
    private tiktokService: TiktokService,
  ) {}

  async findOne(uuid: string) {
    return this.prisma.account.findUnique({
      where: { uuid },
      include: {
        youtubeChannels: true,
        twitterUsers: true,
        instagramUsers: true,
        tiktokUsers: true,
      },
    });
  }

  async addServiceByYoutube(take: number) {
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      take,
      include: { account: { select: { uuid: true } } },
      orderBy: { updatedAt: "asc" },
      where: {
        account: {
          isNot: {
            AND: {
              twitterUsers: { some: {} },
              instagramUsers: { some: {} },
              tiktokUsers: { some: {} },
            },
          },
        },
      },
    });
    for (const [index, channel] of youtubeChannels.entries()) {
      this.logger.log(`${index} ${channel.id}`);
      const linkUrls = (await this.crawlService.getServiceLinkByYoutube(channel.id)) ?? [];
      const services = linkUrls
        .map((url) => this.judgeServiceAccount(url))
        .filter((service) => service.serviceName !== "youtube");
      await this.addServiceByLinkUrls(channel.account.uuid, services);
    }
  }

  async addServiceByTwitter(take: number) {
    const twitterUsers = await this.prisma.twitterUser.findMany({
      take,
      include: { account: { select: { uuid: true } } },
      orderBy: { updatedAt: "asc" },
      where: {
        account: {
          isNot: {
            AND: {
              youtubeChannels: { some: {} },
              instagramUsers: { some: {} },
              tiktokUsers: { some: {} },
            },
          },
        },
      },
    });
    for (const [index, user] of twitterUsers.entries()) {
      this.logger.log(`${index} ${user.id}`);
      const response = await this.twitterService.getUserById(user.id);
      if (!response) {
        return;
      }

      const {
        data: { entities },
      } = response;

      const linkUrls = entities?.url?.urls.map((url) => url.expanded_url) ?? [];
      const uniqueUrls = Array.from(new Set(linkUrls));

      const services = uniqueUrls
        .map((url) => this.judgeServiceAccount(url))
        .filter((service) => service.serviceName !== "twitter");
      await this.addServiceByLinkUrls(user.account.uuid, services);
    }
  }

  async addServiceByLinkUrls(accountId: string, services: ServiceType[]) {
    const serviceAccounts = this.groupByServiceName(services);
    for (const serviceAccount of serviceAccounts) {
      const { serviceName, items } = serviceAccount;
      const firstItem = items[0];
      const { username } = firstItem;
      this.logger.log(`${serviceName}: ${username} ${firstItem.url}`);

      if (!username) {
        continue;
      }

      const account = await this.prisma.account.findUnique({
        where: { uuid: accountId },
        include: { youtubeChannels: true, twitterUsers: true, instagramUsers: true, tiktokUsers: true },
      });

      if (!account) {
        continue;
      }

      if (serviceName === "youtube") {
        if (account.youtubeChannels.length > 0) {
          continue;
        }

        const youtubeChannel = await this.prisma.youtubeChannel.findUnique({ where: { id: username } });
        if (youtubeChannel) {
          continue;
        }

        await this.youtubeService.bulkUpsertChannelByChannelId([{ channelId: username, accountId }], false);
      }

      if (serviceName === "twitter") {
        if (account.twitterUsers.length > 0) {
          continue;
        }

        const twitterUser = await this.prisma.twitterUser.findUnique({ where: { username } });
        if (twitterUser) {
          continue;
        }

        await this.twitterService.upsertUsersByUsername([{ username, accountId }]);
      }

      if (serviceName === "instagram") {
        if (account.instagramUsers.length > 0) {
          continue;
        }

        const instagramUser = await this.prisma.instagramUser.findUnique({ where: { username } });
        if (instagramUser) {
          continue;
        }

        await this.instagramService.upsertUsers([{ username, accountId }]);
      }

      if (serviceName === "tiktok") {
        if (account.tiktokUsers.length > 0) {
          continue;
        }

        const tiktokUser = await this.prisma.tiktokUser.findUnique({ where: { uniqueId: username } });
        if (tiktokUser) {
          continue;
        }

        await this.tiktokService.upsertUser(username, accountId);
      }
    }
  }

  async bulkUpdate(take: number) {
    const beforeDate = dayjs().subtract(1, "day");
    const accounts = await this.prisma.account.findMany({
      take,
      orderBy: { updatedAt: "asc" },
      include: {
        youtubeChannels: { select: { id: true } },
        twitterUsers: { select: { username: true } },
        instagramUsers: { select: { username: true } },
        tiktokUsers: { select: { uniqueId: true } },
      },
      where: { updatedAt: { lte: beforeDate.toDate() } },
    });

    const youtubeBaseDataList = [];
    const twitterBaseDataList = [];
    const instagramBaseDataList = [];
    const tiktokBaseDataList = [];

    for (const account of accounts) {
      const { uuid, youtubeChannels, twitterUsers, instagramUsers, tiktokUsers } = account;
      for (const youtubeChannel of youtubeChannels) {
        youtubeBaseDataList.push({ channelId: youtubeChannel.id, accountId: uuid });
      }
      for (const twitterUser of twitterUsers) {
        twitterBaseDataList.push({ username: twitterUser.username, accountId: uuid });
      }
      for (const instagramUser of instagramUsers) {
        instagramBaseDataList.push({ username: instagramUser.username, accountId: uuid });
      }
      for (const tiktokUser of tiktokUsers) {
        tiktokBaseDataList.push({ uniqueId: tiktokUser.uniqueId, accountId: uuid });
      }
    }

    this.logger.log(
      `account: ${accounts.length}, youtube: ${youtubeBaseDataList.length}, twitter: ${twitterBaseDataList.length}, instagram: ${instagramBaseDataList.length}, tiktok: ${tiktokBaseDataList.length}`,
    );

    await this.youtubeService.bulkUpsertChannelByChannelId(youtubeBaseDataList, false);
    await this.twitterService.upsertUsersByUsername(twitterBaseDataList);
    await this.instagramService.upsertUsers(instagramBaseDataList);
    await this.tiktokService.bulkUpdateByUniqueId(tiktokBaseDataList);
  }

  private groupByServiceName(services: ServiceType[]) {
    return this.utilsService
      .groupByObject(services, (service) => service.serviceName)
      .map(([serviceName, items]) => {
        return { serviceName, items: items.map((item, index) => ({ ...item, num: index + 1 })) };
      });
  }

  private judgeServiceAccount(url: string) {
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
