import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import {
  PaginationInput,
  YoutubeCategoryPaginationInput,
  YoutubeKeywordPaginationInput,
  YoutubeVideoTagPaginationInput,
} from "@/dto/input/pagination.input";
import { YoutubeKeywordSearchInput } from "@/dto/input/youtubeKeywordSearch.input";
import { YoutubeKeywordSearchResult } from "@/dto/output/youtubeKeywordSearch.output";
import {
  YoutubeKeywordIndexPage,
  YoutubeKeywordRankingPage,
  YoutubeRankingPage,
  YoutubeVideoTagIndexPage,
  YoutubeVideoTagRankingPage,
} from "@/dto/output/youtubeRankingPage.output";
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

  @Query((returns) => YoutubeVideoTagRankingPage)
  async getYoutubeVideoTagRankingPage(@Args("pagination") { take, page, tagId }: YoutubeVideoTagPaginationInput) {
    return this.youtubeService.getVideoTagRankingPage({ take, page, tagId });
  }

  @Query((returns) => YoutubeKeywordIndexPage)
  async getYoutubeKeywordIndexPage(@Args("pagination") { take, page }: PaginationInput) {
    return this.youtubeService.getKeywordIndexPage({ take, page });
  }

  @Query((returns) => YoutubeVideoTagIndexPage)
  async getYoutubeVideoTagIndexPage(@Args("pagination") { take, page }: PaginationInput) {
    return this.youtubeService.getVideoTagIndexPage({ take, page });
  }

  @Query((returns) => YoutubeKeywordSearchResult)
  async searchYoutubeKeywordByWord(@Args("input") { take, word }: YoutubeKeywordSearchInput) {
    return this.youtubeService.searchKeywordByWord({ take, word });
  }
}
