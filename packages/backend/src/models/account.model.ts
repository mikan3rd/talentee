import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { InstagramUser } from "@/models/instagramUser.model";
import { TiktokUser } from "@/models/tiktokUser.model";
import { TwitterUser } from "@/models/twitterUser.model";
import { YoutubeChannel } from "@/models/youtubeChannel.model";

@Entity("Account")
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  @Field((type) => ID)
  uuid!: string;

  @Column()
  @Field()
  displayName!: string; // 表示用の名前

  @Column({ unique: true })
  @Field()
  username!: string; // URLなどに使用する半角英数字

  @Column({ type: "text" })
  @Field()
  thumbnailUrl!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @OneToMany((type) => YoutubeChannel, (channel) => channel.account)
  @Field((type) => [YoutubeChannel])
  youtubeChannels!: YoutubeChannel[];

  @OneToMany((type) => TwitterUser, (user) => user.account)
  @Field((type) => [TwitterUser])
  twitterUsers!: TwitterUser[];

  @Field((type) => [InstagramUser])
  instagramUsers!: InstagramUser[];

  @Field((type) => [TiktokUser])
  tiktokUsers!: TiktokUser[];
}
