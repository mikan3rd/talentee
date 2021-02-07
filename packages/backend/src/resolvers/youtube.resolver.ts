import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { YoutubePaginationInput } from "@/dto/pagination.input";
import { YoutubeRankingPage } from "@/dto/youtubeRankingPage.dto";
import { YoutubeService } from "@/services/youtube.service";

@Resolver()
export class YoutubeResolver {
  constructor(@Inject(YoutubeService) private youtubeService: YoutubeService) {}

  @Query((returns) => YoutubeRankingPage)
  async getYoutubeRankingPage(@Args("pagination") { take, page, videoCategoryId }: YoutubePaginationInput) {
    return this.youtubeService.getRankingPage({ take, page, videoCategoryId });
  }
}
