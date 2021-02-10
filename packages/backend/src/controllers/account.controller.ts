import { Body, Controller, Post } from "@nestjs/common";

import { AccountService } from "@/services/account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("/addServiceByYoutube")
  async addServiceByYoutube() {
    return await this.accountService.addServiceByYoutube(30);
  }

  @Post("/addServiceByTwitter")
  async addServiceByTwitter() {
    return await this.accountService.addServiceByTwitter(30);
  }

  @Post("/bulkUpdate")
  async bulkUpdate() {
    return await this.accountService.bulkUpdate(30);
  }

  @Post("/addByFirestore")
  async addByFirestore(
    @Body()
    body: {
      data: {
        youtubeChannelId?: string;
        twitterUsername?: string;
        instagramUsername?: string;
        tiktokUniqueId?: string;
      }[];
    },
  ) {
    return await this.accountService.addByFirestore(body.data);
  }
}
