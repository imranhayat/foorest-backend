import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async generateTokens(user: UserEntity): Promise<TokenPair> {
    const payload: JwtPayload = { sub: user.id, phone: user.phoneNumber };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET', 'changeme'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'changeme-refresh'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const record = this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: this.hash(refreshToken),
      expiresAt,
    });
    await this.refreshTokenRepository.save(record);

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    token: string,
  ): Promise<{ user: UserEntity; tokens: TokenPair }> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'changeme-refresh'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    const record = await this.refreshTokenRepository.findOne({
      where: { userId: payload.sub, tokenHash: this.hash(token) },
      relations: ['user'],
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenRepository.delete(record.id);

    const tokens = await this.generateTokens(record.user);
    return { user: record.user, tokens };
  }

  async logout(userId: string, token: string): Promise<void> {
    await this.refreshTokenRepository.delete({
      userId,
      tokenHash: this.hash(token),
    });
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
