import { Inject, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "@prisma/client";

import { CurrentUser } from "@/decorators/auth.decorator";
import { AccountSearchByUsernameInput } from "@/dto/input/account.input";
import { GqlAuthGuard } from "@/guards/gqlAuthGuard.guard";
import { Account } from "@/models/account.model";
import { User as UserModel } from "@/models/user.model";
import { AdminService } from "@/services/admin.service";

@Resolver()
export class AdminResolver {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  @Query((returns) => UserModel)
  @UseGuards(GqlAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Query((returns) => Account, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async findAccountByUsername(
    @Args("username")
    { youtubeChannelId, twitterUsername, instagramUsername, tiktokUniqueId }: AccountSearchByUsernameInput,
  ) {
    return await this.adminService.findAccountByUsername({
      youtubeChannelId,
      twitterUsername,
      instagramUsername,
      tiktokUniqueId,
    });
  }

  @Mutation((returns) => Account)
  @UseGuards(GqlAuthGuard)
  async addAccountByUsername(
    @Args("username")
    { youtubeChannelId, twitterUsername, instagramUsername, tiktokUniqueId }: AccountSearchByUsernameInput,
  ) {
    const result = await this.adminService.findAccountByUsername({
      youtubeChannelId,
      twitterUsername,
      instagramUsername,
      tiktokUniqueId,
    });

    if (result) {
      throw Error("the username is exist");
    }

    return await this.adminService.addAccountByUsername({
      youtubeChannelId,
      twitterUsername,
      instagramUsername,
      tiktokUniqueId,
    });
  }
}
