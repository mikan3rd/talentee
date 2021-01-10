import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannelVideoCategory } from "typeorm/models/youtubeChannelVideoCategory.model";
import { YoutubeVideo } from "typeorm/models/youtubeVideo.model";

@Entity("YoutubeVideoCategory")
export class YoutubeVideoCategory {
  @PrimaryColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  assignable!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany((type) => YoutubeVideo, (video) => video.channel)
  videos!: YoutubeVideo[];

  @OneToMany((type) => YoutubeChannelVideoCategory, (channelVideoCategory) => channelVideoCategory.videoCategory)
  channelVideoCategories!: YoutubeChannelVideoCategory[];
}
