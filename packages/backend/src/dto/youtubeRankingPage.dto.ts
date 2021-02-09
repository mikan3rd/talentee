import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationCount } from "@/dto/pagination.dto";
import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
export class YoutubeRankingPage extends PaginationCount {
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @Field((type) => [YoutubeVideoCategory])
  youtubeVideoCategories!: YoutubeVideoCategory[];
}
