import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field()
  take!: number;

  @Field(() => ID)
  page!: number;
}
