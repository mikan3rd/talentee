import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeVideo } from "@/models/youtubeVideo.model";

@ObjectType()
export class YoutubeTag {
  @Field()
  id!: number;

  @Field()
  title!: string;

  @Field()
  num!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];
}
