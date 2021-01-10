import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { YoutubeVideo } from "typeorm/models/youtubeVideo.model";

@Entity("YoutubeTag")
export class YoutubeTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column({ type: "int", default: 0, unsigned: true })
  num!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany((type) => YoutubeVideo, (video) => video.tags)
  videos!: YoutubeVideo[];
}
