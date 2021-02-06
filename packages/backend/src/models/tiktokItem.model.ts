import { Field, ID, ObjectType } from "@nestjs/graphql";

import { TiktokUser } from "@/models/tiktokUser.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class TiktokItem {
  @Field((type) => ID)
  id!: string;

  @Field()
  desc!: string;

  @Field((type) => BigIntScalar)
  commentCount!: BigInt;

  @Field((type) => BigIntScalar)
  diggCount!: BigInt;

  @Field((type) => BigIntScalar)
  playCount!: BigInt;

  @Field((type) => BigIntScalar)
  shareCount!: BigInt;

  @Field()
  createdTimestamp!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => TiktokUser)
  user!: TiktokUser;
}
