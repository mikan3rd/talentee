import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Account } from "@/models/account.model";
import { InstagramMedia } from "@/models/instagramMedia.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class InstagramUser {
  @Field((type) => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  username!: string;

  @Field()
  biography!: string;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field()
  profilePicUrl!: string;

  @Field((type) => BigIntScalar)
  followedBy!: BigInt;

  @Field((type) => BigIntScalar)
  follow!: BigInt;

  @Field()
  isVerified!: boolean;

  @Field()
  isPrivate!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  accountId!: string;

  @Field((type) => Account)
  account!: Account;

  @Field((type) => [InstagramMedia])
  mediaList!: InstagramMedia;
}
