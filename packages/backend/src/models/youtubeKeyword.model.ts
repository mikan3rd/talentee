import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeChannel } from "@/models/youtubeChannel.model";

@ObjectType()
export class YoutubeKeyword {
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

  @Field((type) => [YoutubeChannel])
  channels!: YoutubeChannel[];
}
