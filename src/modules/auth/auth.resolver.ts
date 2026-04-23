import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/types/user.type';
import { AuthService } from './auth.service';
import { SendOtpInput } from './dto/send-otp.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { OtpService } from './otp.service';
import { AuthResponse } from './types/auth-response.type';
import { SendOtpResponse } from './types/send-otp-response.type';

function toUserType(entity: UserEntity): UserType {
  return {
    id: entity.id,
    phoneNumber: entity.phoneNumber,
    name: entity.name ?? undefined,
    avatarUrl: entity.avatarUrl ?? undefined,
    bio: entity.bio ?? undefined,
    interests: entity.interests,
    isVerified: entity.isVerified,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
  };
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => SendOtpResponse)
  async sendOtp(
    @Args('input') input: SendOtpInput,
  ): Promise<SendOtpResponse> {
    const result = await this.otpService.sendOtp(input.phoneNumber);
    return { success: true, devOtpCode: result.devOtpCode };
  }

  @Mutation(() => AuthResponse)
  async verifyOtp(
    @Args('input') input: VerifyOtpInput,
  ): Promise<AuthResponse> {
    const valid = await this.otpService.verifyOtp(input.phoneNumber, input.code);
    if (!valid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    const user = await this.usersService.findOrCreate(input.phoneNumber);
    const tokens = await this.authService.generateTokens(user);
    return { ...tokens, user: toUserType(user) };
  }

  @Mutation(() => AuthResponse)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthResponse> {
    const { user, tokens } = await this.authService.refreshTokens(input.token);
    return { ...tokens, user: toUserType(user) };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @Args('refreshToken') refreshToken: string,
    @CurrentUser() user: UserEntity,
  ): Promise<boolean> {
    await this.authService.logout(user.id, refreshToken);
    return true;
  }
}
