import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannel } from "@/models/youtubeChannel.model";

@Entity("YoutubeKeyword")
@ObjectType()
export class YoutubeKeyword {
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

  @ManyToMany((type) => YoutubeChannel, (channel) => channel.keywords)
  @Field((type) => [YoutubeChannel])
  channels!: YoutubeChannel[];
}
