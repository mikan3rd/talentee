import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "@/services/prisma.service";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findOne(uuid: string) {
    return this.prisma.account.findUnique({ where: { uuid } });
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
}
