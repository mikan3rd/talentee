import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeVideo } from "@/models/youtubeVideo.model";

@Entity("YoutubeTag")
@ObjectType()
export class YoutubeTag {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Column({ unique: true })
  @Field()
  title!: string;

  @Column({ type: "int", default: 0, unsigned: true })
  @Field()
  num!: number;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @ManyToMany((type) => YoutubeVideo, (video) => video.tags)
  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];
}
