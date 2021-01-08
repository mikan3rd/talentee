import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, EntityManager, Repository } from "typeorm";

import { PrismaService } from "@/services/prisma.service";
import { Account } from "typeorm/models/account.model";

@Injectable()
export class AccountService {
  constructor(
    // @InjectRepository(Account)
    // private accountRepository: Repository<Account>,
    private prisma: PrismaService,
  ) {}

  // async findOne(id: number) {
  //   return this.accountRepository.findOne(id, { relations: ["youtubeChannels"] });
  // }

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

  async save(payload: DeepPartial<Account>, manager: EntityManager) {
    return manager.getRepository(Account).save(payload);
  }
}
