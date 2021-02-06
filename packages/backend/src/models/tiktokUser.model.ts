import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Account } from "@/models/account.model";
import { TiktokItem } from "@/models/tiktokItem.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@Entity("TiktokUser")
@ObjectType()
export class TiktokUser {
  @PrimaryColumn()
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  nickname!: string;

  @Column({ unique: true })
  @Field()
  uniqueId!: string;

  @Column({ type: "text" })
  @Field()
  signature!: string;

  @Column({ type: "text", nullable: true })
  @Field()
  bioLink!: string;

  @Column({ type: "text" })
  @Field()
  avatarThumb!: string;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  followerCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  followingCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  heartCount!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  videoCount!: BigInt;

  @Column()
  @Field()
  verified!: boolean;

  @Column()
  @Field()
  privateAccount!: boolean;

  @Column()
  @Field()
  secret!: boolean;

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

  @Field((type) => [TiktokItem])
  items!: TiktokItem[];
}
