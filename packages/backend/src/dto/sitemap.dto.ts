import { Field, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
export class Sitemap {
  @Field((type) => [Account])
  accounts!: Account[];

  @Field((type) => [YoutubeVideoCategory])
  youtubeVideoCategories!: YoutubeVideoCategory[];
}
