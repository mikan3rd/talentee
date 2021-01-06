import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { YoutubeChannelModel } from "@/models/youtubeChannel.model";
import { YoutubeTagModel } from "@/models/youtubeTag.model";
import { YoutubeVideoCategoryModel } from "@/models/youtubeVideoCategoriy.model";

@ObjectType()
@Entity("youtubeVideos")
export class YoutubeVideoModel {
  @Field((type) => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: "text" })
  description: string;

  @Field()
  @Column({ type: "text" })
  thumbnailUrl: string;

  @Field()
  @Column({ type: "datetime" })
  publishedAt: Date;

  @Field()
  @Column({ type: "bigint", unsigned: true })
  viewCount: string;

  @Field()
  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  likeCount: string | null;

  @Field()
  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  dislikeCount: string | null;

  @Field()
  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  commentCount: string | null;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => YoutubeTagModel, { defaultValue: [] })
  @ManyToMany((type) => YoutubeTagModel, (tag) => tag.videos)
  @JoinTable({
    name: "youtube_videos_tags",
    joinColumn: {
      name: "video_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags: YoutubeTagModel[];

  @Field((type) => YoutubeVideoCategoryModel)
  @ManyToOne((type) => YoutubeVideoCategoryModel, (category) => category.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "videoCategoryId" })
  videoCategory: YoutubeVideoCategoryModel;

  @Field((type) => YoutubeChannelModel)
  @ManyToOne((type) => YoutubeChannelModel, (channel) => channel.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  channel: YoutubeChannelModel;
}
