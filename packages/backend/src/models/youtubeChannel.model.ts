import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { YoutubeChannelKeywordRelation } from "@/models/youtubeChannelKeywordRelation.model";
import { YoutubeChannelVideoCategory } from "@/models/youtubeChannelVideoCategory.model";
import { YoutubeVideo } from "@/models/youtubeVideo.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class YoutubeChannel {
  @Field((type) => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  thumbnailUrl!: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  publishedAt!: Date;

  @Field((type) => BigIntScalar, { nullable: true })
  subscriberCount?: BigInt;

  @Field((type) => BigIntScalar)
  viewCount!: BigInt;

  @Field((type) => BigIntScalar)
  videoCount!: BigInt;

  @Field()
  hiddenSubscriberCount!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  accountId!: string;

  @Field((type) => Int)
  mainVideoCategoryId!: number;

  @Field((type) => [YoutubeChannelKeywordRelation])
  keywords!: YoutubeChannelKeywordRelation[];

  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];

  @Field((type) => Account)
  account!: Account;

  @Field((type) => [YoutubeChannelVideoCategory])
  channelVideoCategories!: YoutubeChannelVideoCategory[];
}
