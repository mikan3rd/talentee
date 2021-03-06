import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.output";
import { TwitterUser } from "@/models/twitterUser.model";

@ObjectType()
export class TwitterRankingPage extends PaginationCount {
  @Field((type) => [TwitterUser])
  twitterUsers!: TwitterUser[];
}
