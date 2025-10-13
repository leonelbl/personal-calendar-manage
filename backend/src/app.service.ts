import { Injectable } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Tests the database connection
   * Counts how many users and bookings exist
   */
  async testDatabase() {
    const userCount = await this.prisma.user.count();
    const bookingCount = await this.prisma.booking.count();

    return {
      message: 'Database connected successfully! ✅',
      stats: {
        users: userCount,
        bookings: bookingCount,
      },
      database: 'booking_db',
      tables: ['users', 'bookings'],
    };
  }
}