import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomInt } from 'node:crypto';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.module';

@Injectable()
export class OtpService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async sendOtp(phone: string): Promise<{ devOtpCode?: string }> {
    const code = randomInt(100000, 999999).toString();
    const hash = createHash('sha256').update(code).digest('hex');
    await this.redis.setex(`otp:${phone}`, 300, hash);
    if (process.env['AWS_SNS_ENABLED'] !== 'true') {
      console.log(`[OTP DEV] Phone: ${phone} Code: ${code}`);
    }
    return process.env['NODE_ENV'] !== 'production' ? { devOtpCode: code } : {};
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(`otp:${phone}`);
    if (!stored) {
      return false;
    }
    const hash = createHash('sha256').update(code).digest('hex');
    if (hash !== stored) {
      return false;
    }
    await this.redis.del(`otp:${phone}`);
    return true;
  }
}
