import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm";

import { AccountModel } from "@/models/account.model";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountModel)
    private accountRepository: Repository<AccountModel>,
  ) {}

  async findOne(id: number) {
    return this.accountRepository.findOne(id, { relations: ["youtubeChannels"] });
  }

  async findByYoutubeChannelId(id: string) {
    return this.accountRepository.findOne({
      join: { alias: "account", leftJoinAndSelect: { youtubeChannels: "account.youtubeChannels" } },
      where: (qb) => {
        qb.where("youtubeChannels.id = :id", { id });
      },
    });
  }

  async findAll() {
    return this.accountRepository.find({ relations: ["youtubeChannels"] });
  }

  async save(payload: DeepPartial<AccountModel>) {
    return this.accountRepository.save(payload);
  }
}
