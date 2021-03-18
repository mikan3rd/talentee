import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.output";
import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeKeyword } from "@/models/youtubeKeyword.model";
import { YoutubeTag } from "@/models/youtubeTag.model";
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
export class YoutubeVideoTagRankingPage extends PaginationCount {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @Field((type) => YoutubeTag, { nullable: true })
  youtubeTag!: YoutubeTag;
}

@ObjectType()
export class YoutubeKeywordIndexPage extends PaginationCount {
  @Field((type) => [YoutubeKeyword])
  youtubeKeywords!: YoutubeKeyword[];
}

@ObjectType()
export class YoutubeVideoTagIndexPage extends PaginationCount {
  @Field((type) => [YoutubeTag])
  youtubeTags!: YoutubeTag[];
}
