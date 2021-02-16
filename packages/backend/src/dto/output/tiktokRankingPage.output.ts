import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.output";
import { TiktokUser } from "@/models/tiktokUser.model";

@ObjectType()
export class TiktokRankingPage extends PaginationCount {
  @Field((type) => [TiktokUser])
  tiktokUsers!: TiktokUser[];
}
