import { IsUUID, IsEnum, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty() @IsUUID() @IsNotEmpty()
  barberId: string;

  @ApiProperty() @IsUUID() @IsNotEmpty()
  serviceId: string;

  @ApiProperty() @IsDateString() @IsNotEmpty()
  scheduledAt: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}