import { Field, ID, ObjectType } from "@nestjs/graphql";

import { YoutubeTag } from "@/models/youtubeTag.model";
import { YoutubeVideo } from "@/models/youtubeVideo.model";

@ObjectType()
export class YoutubeVideoTagRelation {
  @Field((type) => ID)
  videoId!: string;

  @Field((type) => ID)
  tagOd!: string;

  @Field((type) => YoutubeVideo)
  video!: YoutubeVideo;

  @Field((type) => YoutubeTag)
  tag!: YoutubeTag;
}
