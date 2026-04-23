import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { UserEntity } from './entities/user.entity';
import { UserType } from './types/user.type';

@Resolver(() => UserType)
export class UsersResolver {
  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  me(@CurrentUser() user: UserEntity): UserType {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      bio: user.bio ?? undefined,
      interests: user.interests,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
