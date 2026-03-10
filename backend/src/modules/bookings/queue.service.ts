import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus } from './entities/queue-entry.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry)
    private queueRepo: Repository<QueueEntry>,
  ) {}

  async joinQueue(clientId: string, barberId?: string) {
    const lastEntry = await this.queueRepo.findOne({
      where: { status: QueueStatus.WAITING },
      order: { position: 'DESC' },
    });

    const position = (lastEntry?.position || 0) + 1;
    const estimatedWait = position * 20; // Assume 20 mins per cut

    const entry = this.queueRepo.create({
      clientId,
      barberId,
      position,
      status: QueueStatus.WAITING,
      estimatedWait,
    });

    return this.queueRepo.save(entry);
  }

  async getLiveQueue() {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING },
      relations: ['client', 'barber'],
      order: { position: 'ASC' },
    });
  }
}