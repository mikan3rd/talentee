import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.output";
import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeKeyword } from "@/models/youtubeKeyword.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
export class YoutubeRankingPage extends PaginationCount {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @Field((type) => [YoutubeVideoCategory])
  youtubeVideoCategories!: YoutubeVideoCategory[];
}

@ObjectType()
export class YoutubeKeywordRankingPage extends PaginationCount {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];
}

@ObjectType()
export class YoutubeKeywordIndexPage extends PaginationCount {
  @Field((type) => [YoutubeKeyword])
  youtubeKeywords!: YoutubeKeyword[];
}
