import { Entity, Column, ManyToOne, JoinColumn, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Client } from '../../clients/entities/client.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Service } from '../../barbers/entities/service.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Commission } from '../../payments/entities/commission.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column({ name: 'client_id' })
  @Index('idx_booking_client_id')
  clientId: string;

  @ManyToOne(() => Client, (client) => client.bookings)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'barber_id' })
  @Index('idx_booking_barber_id')
  barberId: string;

  @ManyToOne(() => Barber, (barber) => barber.bookings)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @Column({ name: 'service_id' })
  serviceId: string;

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'scheduled_at', type: 'timestamp' })
  @Index('idx_booking_scheduled_at')
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @OneToOne(() => Commission, (commission) => commission.booking)
  commission: Commission;
}