import { Field, ID, ObjectType } from "@nestjs/graphql";

import { InstagramLocation } from "@/models/instagramLocation.model";
import { InstagramUser } from "@/models/instagramUser.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@ObjectType()
export class InstagramMedia {
  @Field((type) => ID)
  id!: string;

  @Field()
  shortcode!: string;

  @Field()
  thumbnailSrc!: string;

  @Field()
  mediaToCaption!: string;

  @Field()
  displayUrl!: string;

  @Field((type) => BigIntScalar)
  likedBy!: BigInt;

  @Field((type) => BigIntScalar)
  mediaPreviewLike!: BigInt;

  @Field((type) => BigIntScalar)
  mediaToComment!: BigInt;

  @Field((type) => BigIntScalar, { nullable: true })
  videoViewCount?: BigInt;

  @Field({ nullable: true })
  productType?: string;

  @Field()
  isVideo!: boolean;

  @Field()
  takenAtTimestamp!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => InstagramUser)
  user!: InstagramUser;

  @Field((type) => InstagramLocation, { nullable: true })
  location?: InstagramLocation;
}
