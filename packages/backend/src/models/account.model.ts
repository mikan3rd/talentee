import { Field, ID, ObjectType } from "@nestjs/graphql";

import { InstagramUser } from "@/models/instagramUser.model";
import { TiktokUser } from "@/models/tiktokUser.model";
import { TwitterUser } from "@/models/twitterUser.model";
import { YoutubeChannel } from "@/models/youtubeChannel.model";

@ObjectType()
export class Account {
  @Field((type) => ID)
  uuid!: string;

  @Field()
  displayName!: string; // 表示用の名前

  @Field()
  username!: string; // URLなどに使用する半角英数字

  @Field()
  thumbnailUrl!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @Field((type) => [TwitterUser])
  twitterUsers!: TwitterUser[];

  @Field((type) => [InstagramUser])
  instagramUsers!: InstagramUser[];

  @Field((type) => [TiktokUser])
  tiktokUsers!: TiktokUser[];
}
