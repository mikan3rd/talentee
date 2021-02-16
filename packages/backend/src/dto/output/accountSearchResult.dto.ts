import { Field, Int, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/output/pagination.dto";
import { Account } from "@/models/account.model";

@ObjectType()
export class AccountSearchResult extends PaginationCount {
  @Field((type) => [Account])
  accounts!: Account[];

  @Field((type) => Int)
  totalCount!: number;
}
