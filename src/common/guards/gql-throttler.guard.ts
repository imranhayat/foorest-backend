import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<{ req: Record<string, unknown>; res: Record<string, unknown> }>();
    return { req: gqlContext.req, res: gqlContext.res };
  }
}
