import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class AnalyticsService {
  constructor(private dataSource: DataSource) {}

  async getDashboardStats() {
    const revenue = await this.dataSource.query(`
      SELECT SUM(total_price) as total 
      FROM bookings 
      WHERE status = $1 AND scheduled_at >= NOW() - INTERVAL '30 days'
    `, [BookingStatus.COMPLETED]);

    const topBarbers = await this.dataSource.query(`
      SELECT b.full_name, COUNT(bk.id) as booking_count
      FROM users b
      JOIN barbers br ON br.user_id = b.id
      JOIN bookings bk ON bk.barber_id = br.id
      WHERE bk.status = $1
      GROUP BY b.full_name
      ORDER BY booking_count DESC
      LIMIT 5
    `, [BookingStatus.COMPLETED]);

    return {
      monthlyRevenue: revenue[0].total || 0,
      topBarbers,
    };
  }
}