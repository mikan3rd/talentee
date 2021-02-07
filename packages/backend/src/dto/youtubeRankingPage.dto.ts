import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/pagination.dto";
import { YoutubeChannel } from "@/models/youtubeChannel.model";

@ObjectType()
export class YoutubeRankingPage extends PaginationCount {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];
}
