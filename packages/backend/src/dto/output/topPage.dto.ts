import { Field, ObjectType } from "@nestjs/graphql";

import { InstagramUser } from "@/models/instagramUser.model";
import { TiktokUser } from "@/models/tiktokUser.model";
import { TwitterUser } from "@/models/twitterUser.model";
import { YoutubeChannel } from "@/models/youtubeChannel.model";

@ObjectType()
export class TopPage {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @Field((type) => [TwitterUser])
  twitterUsers!: TwitterUser[];

  @Field((type) => [InstagramUser])
  instagramUsers!: InstagramUser[];

  @Field((type) => [TiktokUser])
  tiktokUsers!: TiktokUser[];
}
