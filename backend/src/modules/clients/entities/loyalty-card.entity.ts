import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Client } from './client.entity';

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

@Entity('loyalty_cards')
export class LoyaltyCard extends BaseEntity {
  @Column({ name: 'client_id' })
  @Index('idx_loyalty_client_id')
  clientId: string;

  @OneToOne(() => Client, (client) => client.loyaltyCard)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ default: 0 })
  points: number;

  @Column({
    type: 'enum',
    enum: LoyaltyTier,
    default: LoyaltyTier.BRONZE,
  })
  tier: LoyaltyTier;

  @Column({ type: 'jsonb', nullable: true })
  rewards: any;
}