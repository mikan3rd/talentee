import { Field, InputType } from "@nestjs/graphql";

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
