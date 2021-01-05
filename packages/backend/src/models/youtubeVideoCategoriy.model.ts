import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity("youtubeVideoCategories")
export class YoutubeVideoCategoryModel {
  @Field((type) => ID)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  assignable: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
