import { CustomScalar, Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

export type CustomBigInt = BigInt;
@Scalar("BigInt")
export class BigIntScalar implements CustomScalar<number, BigInt> {
  description = "BigInt custom scalar type";

  serialize(value: BigInt) {
    return Number(value); // value sent to the client
  }

  parseValue(value: number) {
    return BigInt(value); // value from the client
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.INT) {
      return BigInt(ast.value);
    }
    throw Error("parseLiteral");
  }
}
