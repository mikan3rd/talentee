import { Field, ID, ObjectType } from "@nestjs/graphql";

import { InstagramMedia } from "@/models/instagramMedia.model";

@ObjectType()
export class InstagramLocation {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field()
  hasPublicPage!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => [InstagramMedia])
  mediaList!: InstagramMedia[];
}
