import { Field, ObjectType } from "@nestjs/graphql";

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";
import { YoutubeVideoTagRelation } from "@/models/youtubeVideoTagRelation.mode";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class YoutubeVideo {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  thumbnailUrl!: string;

  @Field()
  publishedAt!: Date;

  @Field((type) => BigIntScalar, { nullable: true })
  viewCount?: BigInt;

  @Field((type) => BigIntScalar, { nullable: true })
  likeCount?: BigInt;

  @Field((type) => BigIntScalar, { nullable: true })
  dislikeCount?: BigInt;

  @Field((type) => BigIntScalar, { nullable: true })
  commentCount?: BigInt;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => [YoutubeVideoTagRelation])
  tags!: YoutubeVideoTagRelation[];

  @Field((type) => YoutubeVideoCategory)
  videoCategory!: YoutubeVideoCategory;

  @Field((type) => YoutubeChannel)
  channel!: YoutubeChannel;
}
