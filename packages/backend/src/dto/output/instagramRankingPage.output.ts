import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.output";
import { InstagramUser } from "@/models/instagramUser.model";

@ObjectType()
export class InstagramRankingPage extends PaginationCount {
  @Field((type) => [InstagramUser])
  instagramUsers!: InstagramUser[];
}
