import { Field, ID, ObjectType } from "@nestjs/graphql";

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeKeyword } from "@/models/youtubeKeyword.model";

@ObjectType()
export class YoutubeChannelKeywordRelation {
  @Field((type) => ID)
  channelId!: string;

  @Field((type) => ID)
  keywordId!: string;

  @Field((type) => YoutubeChannel)
  channel!: YoutubeChannel;

  @Field((type) => YoutubeKeyword)
  keyword!: YoutubeKeyword;
}
