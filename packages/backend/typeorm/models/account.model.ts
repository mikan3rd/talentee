import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannel } from "typeorm/models/youtubeChannel.model";

@Entity("Account")
export class Account {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column()
  displayName!: string; // 表示用の名前

  @Column({ unique: true })
  username!: string; // URLなどに使用する半角英数字

  @Column({ type: "text" })
  thumbnailUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany((type) => YoutubeChannel, (channel) => channel.account)
  youtubeChannels!: YoutubeChannel[];
}
