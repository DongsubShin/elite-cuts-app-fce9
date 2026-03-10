import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/booking.dto';
import { Service } from '../barbers/entities/service.entity';
import { Client } from '../clients/entities/client.entity';
import { Commission } from '../payments/entities/commission.entity';
import { Barber } from '../barbers/entities/barber.entity';

@Injectable()
export class BookingsService extends BaseService<Booking> {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    private dataSource: DataSource,
  ) {
    super(bookingRepo, 'Booking');
  }

  async createBooking(dto: CreateBookingDto, userId: string): Promise<Booking> {
    const client = await this.clientRepo.findOne({ where: { userId } });
    if (!client) throw new BadRequestException('Client profile not found');

    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    const booking = this.bookingRepo.create({
      ...dto,
      clientId: client.id,
      totalPrice: service.price,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  async completeBooking(id: string): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await this.bookingRepo.findOne({ 
        where: { id }, 
        relations: ['barber', 'client', 'service'] 
      });
      if (!booking) throw new NotFoundException('Booking not found');

      booking.status = BookingStatus.COMPLETED;
      
      // 1. Update Client Stats
      await queryRunner.manager.increment(Client, { id: booking.clientId }, 'visitCount', 1);

      // 2. Calculate Commission
      const commissionAmount = (Number(booking.totalPrice) * Number(booking.barber.commissionRate)) / 100;
      const commission = queryRunner.manager.create(Commission, {
        barberId: booking.barberId,
        bookingId: booking.id,
        amount: commissionAmount,
        rate: booking.barber.commissionRate,
      });
      await queryRunner.manager.save(commission);

      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();
      return savedBooking;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}