import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginationCount {
  @Field((type) => Int)
  totalPages!: number;
}
