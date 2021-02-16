import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeKeyword } from "@/models/youtubeKeyword.model";

@ObjectType()
export class YoutubeKeywordSearchResult {
  @Field((type) => [YoutubeKeyword])
  youtubeKeywords!: YoutubeKeyword[];
}
