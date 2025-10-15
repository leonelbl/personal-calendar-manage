import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateBookingUseCase } from '../../../core/use-cases/bookings/create-booking.use-case';
import { GetBookingsUseCase } from '../../../core/use-cases/bookings/get-bookings.use-case';
import { DeleteBookingUseCase } from '../../../core/use-cases/bookings/delete-booking.use-case';
import { CreateBookingDto } from '../../dto/booking.dto';

/**
 * BookingsController
 *
 * All routes require authentication (JWT)
 */
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingsUseCase: GetBookingsUseCase,
    private readonly deleteBookingUseCase: DeleteBookingUseCase,
  ) {}

  /**
   * GET /bookings
   * Get all bookings for the authenticated user
   */
  @Get()
  async getBookings(@Request() req) {
    const userId = req.user.id;
    return this.getBookingsUseCase.execute(userId);
  }

  /**
   * POST /bookings
   * Create a new booking
   */
  @Post()
  async createBooking(
    @Request() req,
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
  ) {
    const userId = req.user.id;

    return this.createBookingUseCase.execute(userId, {
      title: createBookingDto.title,
      startTime: new Date(createBookingDto.startTime),
      endTime: new Date(createBookingDto.endTime),
    });
  }

  /**
   * DELETE /bookings/:id
   * Delete a booking
   */
  @Delete(':id')
  async deleteBooking(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.deleteBookingUseCase.execute(id, userId);
  }
}