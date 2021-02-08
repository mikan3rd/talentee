import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { TwitterTweet } from "@/models/twitterTweet.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class TwitterUser {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  username!: string;

  @Field()
  description!: string;

  @Field()
  profileImageUrl!: string;

  @Field((type) => BigIntScalar)
  followersCount!: BigInt;

  @Field((type) => BigIntScalar)
  followingCount!: BigInt;

  @Field((type) => BigIntScalar)
  listedCount!: BigInt;

  @Field((type) => BigIntScalar)
  tweetCount!: BigInt;

  @Field()
  verified!: boolean;

  @Field()
  protected!: boolean;

  @Field()
  createdTimestamp!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  accountId!: string;

  @Field((type) => Account)
  account!: Account;

  @Field((type) => [TwitterTweet])
  tweets!: TwitterTweet;
}
