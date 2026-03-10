import { Entity, Column, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Client } from '../../clients/entities/client.entity';

export enum UserRole {
  ADMIN = 'admin',
  BARBER = 'barber',
  CLIENT = 'client',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'email', unique: true })
  @Index('idx_user_email')
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @OneToOne(() => Barber, (barber) => barber.user)
  barber?: Barber;

  @OneToOne(() => Client, (client) => client.user)
  client?: Client;
}