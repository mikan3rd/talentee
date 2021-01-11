import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannelVideoCategory } from "@/models/youtubeChannelVideoCategory.model";
import { YoutubeVideo } from "@/models/youtubeVideo.model";

@Entity("YoutubeVideoCategory")
@ObjectType()
export class YoutubeVideoCategory {
  @PrimaryColumn()
  @Field()
  id!: number;

  @Column()
  @Field()
  title!: string;

  @Column()
  @Field()
  assignable!: boolean;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @OneToMany((type) => YoutubeVideo, (video) => video.channel)
  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];

  @OneToMany((type) => YoutubeChannelVideoCategory, (channelVideoCategory) => channelVideoCategory.videoCategory)
  @Field((type) => [YoutubeChannelVideoCategory])
  channelVideoCategories!: YoutubeChannelVideoCategory[];
}
