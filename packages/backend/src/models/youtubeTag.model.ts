import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeVideoModel } from "@/models/youtubeVideo.model";

@ObjectType()
@Entity("youtubeTags")
export class YoutubeTagModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column({ type: "int", default: 0, unsigned: true })
  num: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => YoutubeVideoModel, { defaultValue: [] })
  @ManyToMany((type) => YoutubeVideoModel, (video) => video.tags)
  videos: YoutubeVideoModel[];
}
