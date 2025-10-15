import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

/**
 * CreateBookingUseCase
 * 
 * Validate and create a new booking.
 * 1. Valid times (startTime < endTime)
 * 2. No conflicts with existing bookings
 * 3. No conflicts with Google Calendar (coming soon)
 */
@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    data: {
      title: string;
      startTime: Date;
      endTime: Date;
    },
  ) {
    // 1. Validate input times
    if (data.startTime >= data.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Validate that it is not in the past
    if (data.startTime < new Date()) {
      throw new BadRequestException('Cannot create bookings in the past');
    }

    // 2. Check for conflicts with existing user bookings 
    const hasConflict = await this.checkInternalConflicts(
      userId,
      data.startTime,
      data.endTime,
    );

    if (hasConflict) {
      throw new ConflictException(
        'This time slot conflicts with an existing booking',
      );
    }

    // 3. Create the booking
    return this.prisma.booking.create({
      data: {
        userId,
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
      },
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

  /**
   * Verify if the new booking conflicts with existing bookings of the user.
   */
  private async checkInternalConflicts(
    userId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflicts = await this.prisma.booking.findFirst({
      where: {
        userId,
        OR: [
          // Case 1: New booking starts during an existing one
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          // Case 2: New booking ends during an existing one
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          // Case 3: New booking completely wraps an existing one
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    return !!conflicts;
  }
}
