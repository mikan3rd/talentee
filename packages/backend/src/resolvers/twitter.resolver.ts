import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PaginationInput } from "@/dto/input/pagination.input";
import { TwitterRankingPage } from "@/dto/output/twitterRankingPage.dto";
import { TwitterService } from "@/services/twitter.service";

@Resolver()
export class TwitterResolver {
  constructor(@Inject(TwitterService) private twitterService: TwitterService) {}

  @Query((returns) => TwitterRankingPage)
  async getTwitterRankingPage(@Args("pagination") { take, page }: PaginationInput) {
    return await this.twitterService.getRankingPage({ take, page });
  }
}
