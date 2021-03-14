import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext().user;
});
