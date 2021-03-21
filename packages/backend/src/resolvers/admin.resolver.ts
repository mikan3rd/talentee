import { Inject, UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
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
    return this.adminService.findAccountByUsername({
      youtubeChannelId,
      twitterUsername,
      instagramUsername,
      tiktokUniqueId,
    });
  }
}
