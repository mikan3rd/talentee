import { Field, ObjectType } from "@nestjs/graphql";
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

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeTag } from "@/models/youtubeTag.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@Entity("YoutubeVideo")
@ObjectType()
export class YoutubeVideo {
  @PrimaryColumn()
  @Field()
  id!: string;

  @Column()
  @Field()
  title!: string;

  @Column({ type: "text" })
  @Field()
  description!: string;

  @Column({ type: "text" })
  @Field()
  thumbnailUrl!: string;

  @Column({ type: "datetime" })
  @Field()
  publishedAt!: Date;

  @Column({ type: "bigint", unsigned: true })
  @Field()
  viewCount!: string;

  // @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  // @Field()
  // likeCount!: BigInt | null;

  // @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  // @Field()
  // dislikeCount!: BigInt | null;

  // @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  // @Field()
  // commentCount!: BigInt | null;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

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
  @Field((type) => [YoutubeTag])
  tags!: YoutubeTag[];

  @ManyToOne((type) => YoutubeVideoCategory, (category) => category.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "videoCategoryId" })
  @Field((type) => YoutubeVideoCategory)
  videoCategory!: YoutubeVideoCategory;

  @ManyToOne((type) => YoutubeChannel, (channel) => channel.videos, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  @Field((type) => YoutubeChannel)
  channel!: YoutubeChannel;
}
