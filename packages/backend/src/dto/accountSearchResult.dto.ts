import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/pagination.dto";
import { Account } from "@/models/account.model";

@ObjectType()
export class AccountSearchResult extends PaginationCount {
  @Field((type) => [Account])
  accounts!: Account[];
}
