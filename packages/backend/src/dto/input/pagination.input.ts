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
  @Field({ nullable: true })
  keywordTitle?: string;

  @Field((type) => Int, { nullable: true })
  keywordId?: number;
}

@InputType()
export class YoutubeVideoTagPaginationInput extends PaginationInput {
  @Field((type) => Int)
  tagId!: number;
}

@InputType()
export class AccountSearchPaginationInput extends PaginationInput {
  @Field()
  word!: string;
}
