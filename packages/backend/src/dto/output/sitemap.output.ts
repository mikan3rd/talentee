import { Field, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { YoutubeKeyword } from "@/models/youtubeKeyword.model";
import { YoutubeTag } from "@/models/youtubeTag.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
export class Sitemap {
  @Field((type) => [Account])
  accounts!: Account[];

  @Field((type) => [YoutubeVideoCategory])
  youtubeVideoCategories!: YoutubeVideoCategory[];

  @Field((type) => [YoutubeKeyword])
  youtubeKeywords!: YoutubeKeyword[];

  @Field((type) => [YoutubeTag])
  youtubeTags!: YoutubeTag[];
}
