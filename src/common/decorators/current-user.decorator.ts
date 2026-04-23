import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '../../modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserEntity => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: { user: UserEntity } }>().req.user;
  },
);
