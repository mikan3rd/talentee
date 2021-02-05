import { Controller, Post } from "@nestjs/common";

import { AccountService } from "@/services/account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("/addServiceByYoutube")
  async addServiceByYoutube() {
    return await this.accountService.addServiceByYoutube(20);
  }

  @Post("/addServiceByTwitter")
  async addServiceByTwitter() {
    return await this.accountService.addServiceByTwitter(20);
  }

  @Post("/bulkUpdate")
  async bulkUpdate() {
    return await this.accountService.bulkUpdate(20);
  }
}
