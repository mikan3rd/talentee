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
import { BigIntScalar } from "@/scalars/bigint.scalar";

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

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar, { nullable: true })
  viewCount!: BigInt;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar, { nullable: true })
  likeCount!: BigInt;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar, { nullable: true })
  dislikeCount!: BigInt;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar, { nullable: true })
  commentCount!: BigInt;

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
