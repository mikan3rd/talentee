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

import { Account } from "typeorm/models/account.model";
import { YoutubeKeyword } from "typeorm/models/youtubeKeyword.model";
import { YoutubeVideo } from "typeorm/models/youtubeVideo.model";

@Entity("YoutubeChannel")
export class YoutubeChannel {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  thumbnailUrl: string;

  @Column({ nullable: true, default: null })
  country: string;

  @Column({ type: "datetime" })
  publishedAt: Date;

  @Column({ type: "bigint", unsigned: true, nullable: true, default: null })
  subscriberCount: string | null;

  @Column({ type: "bigint", unsigned: true })
  viewCount: string;

  @Column({ type: "bigint", unsigned: true })
  videoCount: string;

  @Column()
  hiddenSubscriberCount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
  keywords: YoutubeKeyword[];

  @OneToMany((type) => YoutubeVideo, (video) => video.channel)
  videos: YoutubeVideo[];

  @ManyToOne((type) => Account, (account) => account.youtubeChannels, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "accountId" })
  account: Account;
}
