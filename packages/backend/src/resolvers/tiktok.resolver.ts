import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PaginationInput } from "@/dto/pagination.input";
import { TiktokUser } from "@/models/tiktokUser.model";
import { TiktokService } from "@/services/tiktok.service";

@Resolver()
export class TiktokResolver {
  constructor(@Inject(TiktokService) private tiktokService: TiktokService) {}

  @Query((returns) => [TiktokUser])
  async getTiktokRankingPage(@Args("pagination") { take, page }: PaginationInput) {
    return this.tiktokService.getRankingPage({ take, page });
  }
}
