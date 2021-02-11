import { Field, ID, ObjectType } from "@nestjs/graphql";

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
export class YoutubeChannelVideoCategory {
  @Field((type) => ID)
  channelId!: string;

  @Field()
  videoCategoryId!: number;

  @Field()
  num!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => YoutubeChannel)
  channel!: YoutubeChannel;

  @Field((type) => YoutubeVideoCategory)
  videoCategory!: YoutubeVideoCategory;
}
