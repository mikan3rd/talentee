import { Inject, UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { User } from "@prisma/client";

import { CurrentUser } from "@/decorators/auth.decorator";
import { GqlAuthGuard } from "@/guards/gqlAuthGuard.guard";
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
}
