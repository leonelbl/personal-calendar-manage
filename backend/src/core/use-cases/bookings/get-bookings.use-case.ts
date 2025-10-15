import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

/**
 * GetBookingsUseCase
 *
 * Get all user bookings ordered by date
 */
@Injectable()
export class GetBookingsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}