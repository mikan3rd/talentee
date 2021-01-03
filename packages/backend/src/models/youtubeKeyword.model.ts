import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannelModel } from "@/models/youtubeChannel.model";

@ObjectType()
@Entity("youtubeKeywords")
export class YoutubeKeywordModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ default: 0 })
  num: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => YoutubeChannelModel, { defaultValue: [] })
  @ManyToMany((type) => YoutubeChannelModel, (channel) => channel.keywords)
  channels: YoutubeChannelModel[];
}
