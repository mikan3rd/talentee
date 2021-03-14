import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

enum UserRole {
  NONE = "NONE",
  ADMIN = "ADMIN",
}

registerEnumType(UserRole, { name: "UserRole" });

@ObjectType()
export class User {
  @Field((type) => ID)
  uid!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field((type) => UserRole)
  role!: UserRole;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
