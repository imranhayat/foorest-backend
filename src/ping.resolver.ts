import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PingResolver {
  @Query(() => String, { description: 'Health ping for GraphQL endpoint' })
  ping(): string {
    return 'pong';
  }
}
