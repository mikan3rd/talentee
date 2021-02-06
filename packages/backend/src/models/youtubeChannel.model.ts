import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Account } from "@/models/account.model";
import { YoutubeChannelKeywordRelation } from "@/models/youtubeChannelKeywordRelation.model";
import { YoutubeChannelVideoCategory } from "@/models/youtubeChannelVideoCategory.model";
import { YoutubeVideo } from "@/models/youtubeVideo.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@Entity("YoutubeChannel")
@ObjectType()
export class YoutubeChannel {
  @PrimaryColumn()
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  title!: string;

  @Column({ type: "text" })
  @Field()
  description!: string;

  @Column({ type: "text" })
  @Field()
  thumbnailUrl!: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  country!: string;

  @Column({ type: "datetime" })
  @Field()
  publishedAt!: Date;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar, { nullable: true })
  subscriberCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  viewCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  videoCount!: BigInt;

  @Column()
  @Field()
  hiddenSubscriberCount!: boolean;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @Field((type) => [YoutubeChannelKeywordRelation])
  keywords!: YoutubeChannelKeywordRelation[];

  @OneToMany((type) => YoutubeVideo, (video) => video.channel)
  @Field((type) => [YoutubeVideo])
  videos!: YoutubeVideo[];

  @ManyToOne((type) => Account, (account) => account.youtubeChannels, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "accountId" })
  @Field((type) => Account)
  account!: Account;

  @OneToMany((type) => YoutubeChannelVideoCategory, (channelVideoCategory) => channelVideoCategory.channel)
  @Field((type) => [YoutubeChannelVideoCategory])
  channelVideoCategories!: YoutubeChannelVideoCategory[];
}
