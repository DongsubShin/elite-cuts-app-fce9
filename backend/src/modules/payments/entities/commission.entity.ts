import { Entity, Column, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('commissions')
export class Commission extends BaseEntity {
  @Column({ name: 'barber_id' })
  @Index('idx_commission_barber_id')
  barberId: string;

  @ManyToOne(() => Barber, (barber) => barber.commissions)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @Column({ name: 'booking_id' })
  @Index('idx_commission_booking_id')
  bookingId: string;

  @OneToOne(() => Booking, (booking) => booking.commission)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;
}