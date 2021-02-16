import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PaginationInput } from "@/dto/input/pagination.input";
import { InstagramRankingPage } from "@/dto/output/instagramRankingPage.output";
import { InstagramService } from "@/services/instagram.service";

@Resolver()
export class InstagramResolver {
  constructor(@Inject(InstagramService) private instagramService: InstagramService) {}

  @Query((returns) => InstagramRankingPage)
  async getInstagramRankingPage(@Args("pagination") { take, page }: PaginationInput) {
    return await this.instagramService.getRankingPage({ take, page });
  }
}
