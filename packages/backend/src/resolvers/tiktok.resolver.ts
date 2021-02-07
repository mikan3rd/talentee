import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PaginationInput } from "@/dto/pagination.input";
import { TiktokRankingPage } from "@/dto/tiktokRankingPage.dto";
import { TiktokService } from "@/services/tiktok.service";

@Resolver()
export class TiktokResolver {
  constructor(@Inject(TiktokService) private tiktokService: TiktokService) {}

  @Query((returns) => TiktokRankingPage)
  async getTiktokRankingPage(@Args("pagination") { take, page }: PaginationInput) {
    return await this.tiktokService.getRankingPage({ take, page });
  }
}
