import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyCard, LoyaltyTier } from './entities/loyalty-card.entity';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyCard)
    private loyaltyRepo: Repository<LoyaltyCard>,
  ) {}

  async addPoints(clientId: string, points: number) {
    const card = await this.loyaltyRepo.findOne({ where: { clientId } });
    if (!card) return;

    card.points += points;
    
    // Tier Logic
    if (card.points >= 1000) card.tier = LoyaltyTier.PLATINUM;
    else if (card.points >= 500) card.tier = LoyaltyTier.GOLD;
    else if (card.points >= 200) card.tier = LoyaltyTier.SILVER;

    return this.loyaltyRepo.save(card);
  }
}