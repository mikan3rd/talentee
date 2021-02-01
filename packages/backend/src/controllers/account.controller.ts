import { Controller, Get } from "@nestjs/common";

import { AccountService } from "@/services/account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("/addServiceByYoutube")
  async addServiceByYoutube() {
    await this.accountService.addServiceByYoutube(10);
  }

  @Get("/addServiceByTwitter")
  async addServiceByTwitter() {
    await this.accountService.addServiceByTwitter(10);
  }
}
