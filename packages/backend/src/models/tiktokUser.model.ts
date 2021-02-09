import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { TiktokItem } from "@/models/tiktokItem.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class TiktokUser {
  @Field((type) => ID)
  id!: string;

  @Field()
  nickname!: string;

  @Field()
  uniqueId!: string;

  @Field()
  signature!: string;

  @Field({ nullable: true })
  bioLink?: string;

  @Field()
  avatarThumb!: string;

  @Field((type) => BigIntScalar)
  followerCount!: BigInt;

  @Field((type) => BigIntScalar)
  followingCount!: BigInt;

  @Field((type) => BigIntScalar)
  heartCount!: BigInt;

  @Field((type) => BigIntScalar)
  videoCount!: BigInt;

  @Field()
  verified!: boolean;

  @Field()
  privateAccount!: boolean;

  @Field()
  secret!: boolean;

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

  @Field((type) => [TiktokItem])
  items!: TiktokItem[];
}
