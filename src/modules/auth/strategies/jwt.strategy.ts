import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sub: string;
  phone: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET', 'changeme'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive || user.isBlocked) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
