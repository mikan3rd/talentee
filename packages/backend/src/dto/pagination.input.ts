import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field((type) => Int)
  take!: number;

  @Field((type) => Int)
  page!: number;
}

@InputType()
export class YoutubePaginationInput extends PaginationInput {
  @Field((type) => Int, { nullable: true })
  videoCategoryId?: number;

  @Field()
  isAll?: boolean;
}
