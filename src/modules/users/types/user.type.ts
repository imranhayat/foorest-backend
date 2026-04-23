import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [String])
  interests: string[];

  @Field()
  isVerified: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}
