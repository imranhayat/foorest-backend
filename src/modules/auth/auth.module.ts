import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { OtpService } from './otp.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    UsersModule,
  ],
  providers: [AuthResolver, AuthService, OtpService, JwtStrategy],
})
export class AuthModule {}
