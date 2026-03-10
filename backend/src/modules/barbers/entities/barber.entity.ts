import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { QueueEntry } from '../../bookings/entities/queue-entry.entity';
import { Commission } from '../../payments/entities/commission.entity';

@Entity('barbers')
export class Barber extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index('idx_barber_user_id')
  userId: string;

  @OneToOne(() => User, (user) => user.barber)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  specialties: string[];

  @Column({ name: 'working_hours', type: 'jsonb', nullable: true })
  workingHours: any;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @OneToMany(() => Booking, (booking) => booking.barber)
  bookings: Booking[];

  @OneToMany(() => QueueEntry, (queue) => queue.barber)
  queueEntries: QueueEntry[];

  @OneToMany(() => Commission, (commission) => commission.barber)
  commissions: Commission[];
}