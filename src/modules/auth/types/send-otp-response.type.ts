import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendOtpResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  devOtpCode?: string;
}
