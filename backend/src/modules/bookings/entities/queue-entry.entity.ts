import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Client } from '../../clients/entities/client.entity';
import { Barber } from '../../barbers/entities/barber.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  SERVING = 'serving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queue_entries')
export class QueueEntry extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => Client, (client) => client.queueEntries)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'barber_id', nullable: true })
  barberId: string;

  @ManyToOne(() => Barber, (barber) => barber.queueEntries)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @Column({ type: 'int' })
  position: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ name: 'estimated_wait_minutes', type: 'int' })
  estimatedWait: number;
}