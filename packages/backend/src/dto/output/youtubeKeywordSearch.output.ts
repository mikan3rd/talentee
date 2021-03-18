import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeKeyword } from "@/models/youtubeKeyword.model";
import { YoutubeTag } from "@/models/youtubeTag.model";

@ObjectType()
export class YoutubeKeywordSearchResult {
  @Field((type) => [YoutubeKeyword])
  youtubeKeywords!: YoutubeKeyword[];

  @Field((type) => [YoutubeTag])
  youtubeTags!: YoutubeTag[];
}
