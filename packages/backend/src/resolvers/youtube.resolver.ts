import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { PaginationInput, YoutubeCategoryPaginationInput, YoutubeKeywordPaginationInput } from "@/dto/pagination.input";
import { YoutubeKeywordSearchResult } from "@/dto/youtubeKeywordSearch.dto";
import { YoutubeKeywordSearchInput } from "@/dto/youtubeKeywordSearch.input";
import { YoutubeKeywordIndexPage, YoutubeKeywordRankingPage, YoutubeRankingPage } from "@/dto/youtubeRankingPage.dto";
import { YoutubeService } from "@/services/youtube.service";

@Resolver()
export class YoutubeResolver {
  constructor(@Inject(YoutubeService) private youtubeService: YoutubeService) {}

  @Query((returns) => YoutubeRankingPage)
  async getYoutubeCategoryRankingPage(
    @Args("pagination") { take, page, videoCategoryId, isAll }: YoutubeCategoryPaginationInput,
  ) {
    return this.youtubeService.getCategoryRankingPage({ take, page, videoCategoryId, isAll });
  }

  @Query((returns) => YoutubeKeywordRankingPage)
  async getYoutubeKeywordRankingPage(@Args("pagination") { take, page, keywordTitle }: YoutubeKeywordPaginationInput) {
    return this.youtubeService.getKeywordRankingPage({ take, page, keywordTitle });
  }

  @Query((returns) => YoutubeKeywordIndexPage)
  async getYoutubeKeywordIndexPage(@Args("pagination") { take, page }: PaginationInput) {
    return this.youtubeService.getKeywordIndexPage({ take, page });
  }

  @Query((returns) => YoutubeKeywordSearchResult)
  async searchYoutubeKeywordByWord(@Args("input") { take, word }: YoutubeKeywordSearchInput) {
    return this.youtubeService.searchKeywordByWord({ take, word });
  }
}
