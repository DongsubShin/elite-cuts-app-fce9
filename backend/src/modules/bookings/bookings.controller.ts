import { Controller, Post, Get, Patch, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dtos/booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingsService.createBooking(dto, user.sub);
  }

  @Get('my-appointments')
  @ApiOperation({ summary: 'Get current user appointments' })
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.findAll({ where: { client: { userId: user.sub } } });
  }

  @Patch(':id/complete')
  @Roles(UserRole.BARBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark booking as completed (Triggers commission & loyalty)' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.completeBooking(id);
  }
}