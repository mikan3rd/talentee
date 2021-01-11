import { Inject } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeService } from "@/services/youtube.service";

@Resolver()
export class YoutubeResolver {
  constructor(@Inject(YoutubeService) private youtubeService: YoutubeService) {}

  @Query((returns) => [YoutubeChannel])
  async youtubeChannelByMainVideoCategory(@Args("videoCategoryId", { type: () => Int }) videoCategoryId: number) {
    return this.youtubeService.getChannelByMainCategory(videoCategoryId);
  }
}
