import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByPhone(phoneNumber: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ phoneNumber });
  }

  async findOrCreate(phoneNumber: string): Promise<UserEntity> {
    const existing = await this.findByPhone(phoneNumber);
    if (existing) {
      return existing;
    }
    const user = this.usersRepository.create({ phoneNumber });
    return this.usersRepository.save(user);
  }
}
