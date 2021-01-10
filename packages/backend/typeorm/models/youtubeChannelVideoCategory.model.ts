import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannel } from "typeorm/models/youtubeChannel.model";
import { YoutubeVideoCategory } from "typeorm/models/youtubeVideoCategoriy.model";

@Entity("YoutubeChannelVideoCategory")
export class YoutubeChannelVideoCategory {
  @PrimaryColumn()
  channelId!: string;

  @PrimaryColumn()
  videoCategoryId!: number;

  @Column({ type: "int", default: 0, unsigned: true })
  num!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => YoutubeChannel, (channel) => channel.channelVideoCategories, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  channel!: YoutubeChannel;

  @ManyToOne((type) => YoutubeVideoCategory, (videoCategory) => videoCategory.channelVideoCategories, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "videoCategoryId" })
  videoCategory!: YoutubeVideoCategory;
}
