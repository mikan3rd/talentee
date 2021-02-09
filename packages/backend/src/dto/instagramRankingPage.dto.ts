import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/pagination.dto";
import { InstagramUser } from "@/models/instagramUser.model";

@ObjectType()
export class InstagramRankingPage extends PaginationCount {
  @Field((type) => [InstagramUser])
  instagramUsers!: InstagramUser[];
}
