import { Controller, Post } from "@nestjs/common";

import { AccountService } from "@/services/account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("/addServiceByYoutube")
  async addServiceByYoutube() {
    return await this.accountService.addServiceByYoutube(50);
  }

  @Post("/addServiceByTwitter")
  async addServiceByTwitter() {
    return await this.accountService.addServiceByTwitter(50);
  }

  @Post("/bulkUpdate")
  async bulkUpdate() {
    return await this.accountService.bulkUpdate(50);
  }

  @Post("/addYoutubeChannelByYoutura")
  async addYoutubeChannelByYoutura() {
    await this.accountService.addYoutubeChannelByYoutura(1);
  }

  @Post("/tweetRandomYoutubeAccount")
  async tweetRandomYoutubeAccount() {
    await this.accountService.tweetRandomYoutubeAccount();
  }

  @Post("/updateTwitterCardCache")
  async updateTwitterCardCache() {
    await this.accountService.updateTwitterCardCache();
  }
}
