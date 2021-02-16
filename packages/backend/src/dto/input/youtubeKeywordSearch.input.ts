import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class YoutubeKeywordSearchInput {
  @Field((type) => Int)
  take!: number;

  @Field()
  word!: string;
}
