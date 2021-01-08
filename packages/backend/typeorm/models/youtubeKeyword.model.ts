import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeChannel } from "typeorm/models/youtubeChannel.model";

@Entity("YoutubeKeyword")
export class YoutubeKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: "int", default: 0, unsigned: true })
  num: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((type) => YoutubeChannel, (channel) => channel.keywords)
  channels: YoutubeChannel[];
}
