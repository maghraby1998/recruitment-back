import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Auth = createParamDecorator(
  (authProperty: string, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);

    const auth = gqlContext.getContext().req.user;

    return authProperty ? auth && auth?.[authProperty] : auth;
  },
);
