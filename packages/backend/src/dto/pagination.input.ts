import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field((type) => Int)
  take!: number;

  @Field((type) => Int)
  page!: number;
}
