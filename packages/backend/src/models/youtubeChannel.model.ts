import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Account } from "@/models/account.model";
import { YoutubeChannelVideoCategory } from "@/models/youtubeChannelVideoCategory.model";
import { YoutubeKeyword } from "@/models/youtubeKeyword.model";
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
  @Field()
  country!: string;

  @Column({ type: "datetime" })
  @Field()
  publishedAt!: Date;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  @Field((type) => BigIntScalar)
  subscriberCount!: number;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  viewCount!: number;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  videoCount!: number;

  @Column()
  @Field()
  hiddenSubscriberCount!: boolean;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @ManyToMany((type) => YoutubeKeyword, (keyword) => keyword.channels)
  @JoinTable({
    name: "YoutubeChannelKeywordRelation",
    joinColumn: {
      name: "channelId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "keywordId",
      referencedColumnName: "id",
    },
  })
  @Field((type) => [YoutubeKeyword])
  keywords!: YoutubeKeyword[];

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
