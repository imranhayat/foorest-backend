import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../users/types/user.type';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserType)
  user: UserType;
}
