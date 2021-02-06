import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Account } from "@/models/account.model";
import { TwitterTweet } from "@/models/twitterTweet.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@Entity("TwitterUser")
@ObjectType()
export class TwitterUser {
  @PrimaryColumn()
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  name!: string;

  @Column({ unique: true })
  @Field()
  username!: string;

  @Column({ type: "text" })
  @Field()
  description!: string;

  @Column({ type: "text" })
  @Field()
  profileImageUrl!: string;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  followersCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  followingCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  listedCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  tweetCount!: BigInt;

  @Column()
  @Field()
  verified!: boolean;

  @Column()
  @Field()
  protected!: boolean;

  @Column()
  @Field()
  createdTimestamp!: Date;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @ManyToOne((type) => Account, (account) => account.youtubeChannels, {
    nullable: false,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "accountId" })
  @Field((type) => Account)
  account!: Account;

  @Field((type) => [TwitterTweet])
  tweets!: TwitterTweet;
}
