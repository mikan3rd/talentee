import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeVideoModel } from "@/models/youtubeVideo.model";

@ObjectType()
@Entity("youtubeVideoCategories")
export class YoutubeVideoCategoryModel {
  @Field((type) => ID)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  assignable: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => [YoutubeVideoModel], { defaultValue: [] })
  @OneToMany((type) => YoutubeVideoModel, (video) => video.channel)
  videos: YoutubeVideoModel[];
}
