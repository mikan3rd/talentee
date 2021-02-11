import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeChannelVideoCategory } from "@/models/youtubeChannelVideoCategory.model";
import { YoutubeVideo } from "@/models/youtubeVideo.model";

@ObjectType()
export class YoutubeVideoCategory {
  @Field()
  id!: number;

  @Field()
  title!: string;

  @Field()
  assignable!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];

  @Field((type) => [YoutubeChannelVideoCategory])
  channelVideoCategories!: YoutubeChannelVideoCategory[];
}
