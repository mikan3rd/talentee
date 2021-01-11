import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannel } from "@/models/youtubeChannel.model";
import { YoutubeVideoCategory } from "@/models/youtubeVideoCategoriy.model";

@Entity("YoutubeChannelVideoCategory")
@ObjectType()
export class YoutubeChannelVideoCategory {
  @PrimaryColumn()
  @Field()
  channelId!: string;

  @PrimaryColumn()
  @Field()
  videoCategoryId!: number;

  @Column({ type: "int", default: 0, unsigned: true })
  @Field()
  num!: number;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @ManyToOne((type) => YoutubeChannel, (channel) => channel.channelVideoCategories, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  @Field((type) => YoutubeChannel)
  channel!: YoutubeChannel;

  @ManyToOne((type) => YoutubeVideoCategory, (videoCategory) => videoCategory.channelVideoCategories, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "videoCategoryId" })
  @Field((type) => YoutubeVideoCategory)
  videoCategory!: YoutubeVideoCategory;
}
