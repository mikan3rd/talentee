import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { YoutubeKeywordModel } from "@/models/youtubeKeyword.model";

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
  @Column({ type: "date" })
  publishedAt: Date;

  @Field()
  @Column()
  subscriberCount: number;

  @Field()
  @Column()
  videoCount: number;

  @Field()
  @Column()
  viewCount: number;

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
}
