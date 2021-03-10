import { Inject, UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "@/guards/gqlAuthGuard.guard";
import { Account } from "@/models/account.model";
import { AdminService } from "@/services/admin.service";

@Resolver()
export class AdminResolver {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  // TODO: currentUserを返すように修正
  @Query((returns) => Account)
  @UseGuards(GqlAuthGuard)
  async getCurrentUser() {
    return await this.adminService.test();
  }
}
