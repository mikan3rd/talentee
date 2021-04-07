import { Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class AccountSearchByUsernameInput {
  @Field({ nullable: true })
  youtubeChannelId?: string;

  @Field({ nullable: true })
  twitterUsername?: string;

  @Field({ nullable: true })
  instagramUsername?: string;

  @Field({ nullable: true })
  tiktokUniqueId?: string;
}

@InputType()
export class AccountSearchInput {
  @Field((type) => Int)
  take!: number;

  @Field()
  word!: string;
}

@InputType()
export class AccountEditInput {
  @Field((type) => ID)
  uuid!: string;

  @Field()
  displayName!: string;
}
