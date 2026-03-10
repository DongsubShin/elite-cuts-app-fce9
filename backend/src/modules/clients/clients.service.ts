import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from './entities/client.entity';
import { UpdateClientDto } from './dtos/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  async searchClients(query: string) {
    return this.clientRepo.find({
      where: [
        { phone: Like(`%${query}%`) },
        { user: { fullName: Like(`%${query}%`) } },
      ],
      relations: ['user', 'loyaltyCard'],
    });
  }

  async updateNotes(id: string, notes: string) {
    return this.clientRepo.update(id, { notes });
  }
}