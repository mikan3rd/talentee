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

import { AccountModel } from "@/models/account.model";
import { YoutubeKeywordModel } from "@/models/youtubeKeyword.model";
import { YoutubeVideoModel } from "@/models/youtubeVideo.model";

@ObjectType()
@Entity("youtubeChannels")
export class YoutubeChannelModel {
  @Field((type) => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: "text" })
  description: string;

  @Field()
  @Column({ type: "text" })
  thumbnailUrl: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ type: "datetime" })
  publishedAt: Date;

  @Field()
  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  subscriberCount: string;

  @Field()
  @Column({ type: "bigint", unsigned: true })
  viewCount: string;

  @Field()
  @Column({ type: "bigint", unsigned: true })
  videoCount: string;

  @Field()
  @Column()
  hiddenSubscriberCount: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => YoutubeKeywordModel, { defaultValue: [] })
  @ManyToMany((type) => YoutubeKeywordModel, (keyword) => keyword.channels)
  @JoinTable({
    name: "youtube_channels_keywords",
    joinColumn: {
      name: "channel_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "keyword_id",
      referencedColumnName: "id",
    },
  })
  keywords: YoutubeKeywordModel[];

  @Field((type) => [YoutubeVideoModel], { defaultValue: [] })
  @OneToMany((type) => YoutubeVideoModel, (video) => video.channel)
  videos: YoutubeVideoModel[];

  @Field((type) => AccountModel)
  @ManyToOne((type) => AccountModel, (account) => account.youtubeChannels, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "accountId" })
  account: AccountModel;
}
