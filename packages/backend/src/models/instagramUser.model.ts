import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Account } from "@/models/account.model";
import { BigIntScalar } from "@/scalars/bigint.scalar";

@Entity("InstagramUser")
@ObjectType()
export class TwitterUser {
  @PrimaryColumn()
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  fullName!: string;

  @Column({ unique: true })
  @Field()
  username!: string;

  @Column({ type: "text" })
  @Field()
  biography!: string;

  @Column({ type: "text", nullable: true })
  @Field()
  externalUrl!: string;

  @Column({ type: "text" })
  @Field()
  profilePicUrl!: string;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  followedBy!: BigInt;

  @Column({ type: "bigint", unsigned: true })
  @Field((type) => BigIntScalar)
  follow!: BigInt;

  @Column()
  @Field()
  isVerified!: boolean;

  @Column()
  @Field()
  isPrivate!: boolean;

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
}
