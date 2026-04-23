import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string | null;

  @Column({ name: 'avatar_url', nullable: true, type: 'varchar' })
  avatarUrl: string | null;

  @Column({ nullable: true, type: 'text' })
  bio: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  interests: string[];

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
