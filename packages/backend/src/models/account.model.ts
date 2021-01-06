import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannelModel } from "@/models/youtubeChannel.model";

@ObjectType()
@Entity("accounts")
export class AccountModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column()
  displayName: string; // 表示用の名前

  @Field()
  @Column({ unique: true })
  username: string; // URLなどに使用する半角英数字

  @Field()
  @Column({ type: "text" })
  thumbnailUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => [YoutubeChannelModel], { defaultValue: [] })
  @OneToMany((type) => YoutubeChannelModel, (channel) => channel.account)
  youtubeChannels: YoutubeChannelModel[];
}
