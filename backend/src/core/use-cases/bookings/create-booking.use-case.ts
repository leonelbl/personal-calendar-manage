import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { GoogleCalendarService } from 'src/infrastructure/google/google-calendar.service';

/**
 * CreateBookingUseCase
 * 
 * Validate and create a new booking.
 * 1. Valid times (startTime < endTime)
 * 2. No conflicts with existing bookings
 * 3. No conflicts with Google Calendar
 * 4. Create the booking in the database
 * 
 * If any validation fails, throw an appropriate exception.
 * 
 * Note: This use case assumes the user is authenticated and userId is valid.
 */
@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

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
    const hasInternalConflict = await this.checkInternalConflicts(
      userId,
      data.startTime,
      data.endTime,
    );

    if (hasInternalConflict) {
      throw new ConflictException(
        'This time slot conflicts with an existing booking',
      );
    }

    // 3. Check for conflicts with Google Calendar
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { accessToken: true },
    });

    if (user?.accessToken) {
      const googleConflictResult = await this.googleCalendarService.checkConflicts(
        user.accessToken,
        data.startTime,
        data.endTime,
      );

      if (googleConflictResult.hasConflict) {
        // Obtener nombres de eventos conflictivos
        const eventNames = googleConflictResult.events
          ?.map((e) => e.summary)
          .join(', ');

        throw new ConflictException(
          `This time slot conflicts with Google Calendar events: ${eventNames || 'Unknown events'}`,
        );
      }
    }

    // 4. Create the booking
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
