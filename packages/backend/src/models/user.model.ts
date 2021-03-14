import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field((type) => ID)
  uid!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
