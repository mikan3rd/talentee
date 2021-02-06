import { Field, ID, ObjectType } from "@nestjs/graphql";

import { TwitterUser } from "@/models/twitterUser.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class TwitterTweet {
  @Field((type) => ID)
  id!: string;

  @Field()
  text!: string;

  @Field((type) => BigIntScalar)
  retweetCount!: BigInt;

  @Field((type) => BigIntScalar)
  replyCount!: BigInt;

  @Field((type) => BigIntScalar)
  likeCount!: BigInt;

  @Field((type) => BigIntScalar)
  quoteCount!: BigInt;

  @Field()
  possiblySensitive!: boolean;

  @Field({ nullable: true })
  tweetType?: string;

  @Field()
  createdTimestamp!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => TwitterUser)
  user!: TwitterUser;
}
