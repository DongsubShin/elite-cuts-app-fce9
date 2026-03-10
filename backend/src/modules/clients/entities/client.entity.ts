import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { QueueEntry } from '../../bookings/entities/queue-entry.entity';
import { LoyaltyCard } from './loyalty-card.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index('idx_client_user_id')
  userId: string;

  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  @Index('idx_client_phone')
  phone: string;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Booking, (booking) => booking.client)
  bookings: Booking[];

  @OneToMany(() => QueueEntry, (queue) => queue.client)
  queueEntries: QueueEntry[];

  @OneToOne(() => LoyaltyCard, (card) => card.client)
  loyaltyCard: LoyaltyCard;

  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];
}