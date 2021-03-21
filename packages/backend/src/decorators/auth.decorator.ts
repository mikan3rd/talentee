import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserRole } from "@prisma/client";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext().user;
});

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
