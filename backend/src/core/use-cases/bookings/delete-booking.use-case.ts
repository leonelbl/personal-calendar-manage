import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

/**
 * DeleteBookingUseCase
 * 
 * Validate and delete a booking from a user.
 * 1. Booking exists
 * 2. Booking belongs to user
 * 3. Delete booking
 */
@Injectable()
export class DeleteBookingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bookingId: string, userId: string) {
    // Verify that the booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify that it belongs to the user
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    // Delete the booking
    await this.prisma.booking.delete({
      where: { id: bookingId },
    });

    return { message: 'Booking deleted successfully' };
  }
}