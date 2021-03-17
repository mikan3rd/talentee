import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field((type) => Int)
  take!: number;

  @Field((type) => Int)
  page!: number;
}

@InputType()
export class YoutubeCategoryPaginationInput extends PaginationInput {
  @Field((type) => Int, { nullable: true })
  videoCategoryId?: number;

  @Field()
  isAll?: boolean;
}

@InputType()
export class YoutubeKeywordPaginationInput extends PaginationInput {
  @Field()
  keywordTitle!: string;
}

@InputType()
export class YoutubeVideoTagPaginationInput extends PaginationInput {
  @Field((type) => Int)
  tagId!: number;
}

@InputType()
export class AccountSearchInput extends PaginationInput {
  @Field()
  word!: string;
}
