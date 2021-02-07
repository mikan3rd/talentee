import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { InstagramRankingPage } from "@/dto/instagramRankingPage.dto";
import { PaginationInput } from "@/dto/pagination.input";
import { InstagramService } from "@/services/instagram.service";

@Resolver()
export class InstagramResolver {
  constructor(@Inject(InstagramService) private instagramService: InstagramService) {}

  @Query((returns) => InstagramRankingPage)
  async getInstagramRankingPage(@Args("pagination") { take, page }: PaginationInput) {
    return await this.instagramService.getRankingPage({ take, page });
  }
}
