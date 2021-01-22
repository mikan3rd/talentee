import { Inject } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { AccountService } from "@/services/account.service";

@Resolver()
export class AccountResolver {
  constructor(@Inject(AccountService) private accountService: AccountService) {}

  @Query((returns) => Account, { nullable: true })
  async account(@Args("uuid", { type: () => ID }) uuid: string) {
    return await this.accountService.findOne(uuid);
  }
}
