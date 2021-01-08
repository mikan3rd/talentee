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

import { YoutubeChannel } from "typeorm/models/youtubeChannel.model";
import { YoutubeTag } from "typeorm/models/youtubeTag.model";
import { YoutubeVideoCategory } from "typeorm/models/youtubeVideoCategoriy.model";

@Entity("YoutubeVideo")
export class YoutubeVideo {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  thumbnailUrl: string;

  @Column({ type: "datetime" })
  publishedAt: Date;

  @Column({ type: "bigint", unsigned: true })
  viewCount: string;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  likeCount: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  dislikeCount: string | null;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  commentCount: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((type) => YoutubeTag, (tag) => tag.videos)
  @JoinTable({
    name: "YoutubeVideoTagRelation",
    joinColumn: {
      name: "videoId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tagId",
      referencedColumnName: "id",
    },
  })
  tags: YoutubeTag[];

  @ManyToOne((type) => YoutubeVideoCategory, (category) => category.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "videoCategoryId" })
  videoCategory: YoutubeVideoCategory;

  @ManyToOne((type) => YoutubeChannel, (channel) => channel.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  channel: YoutubeChannel;
}
