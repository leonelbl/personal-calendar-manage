import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { CreateBookingUseCase } from '../../../core/use-cases/bookings/create-booking.use-case';
import { GetBookingsUseCase } from '../../../core/use-cases/bookings/get-bookings.use-case';
import { DeleteBookingUseCase } from '../../../core/use-cases/bookings/delete-booking.use-case';

@Module({
  controllers: [BookingsController],
  providers: [
    CreateBookingUseCase,
    GetBookingsUseCase,
    DeleteBookingUseCase,
  ],
  exports: [
    CreateBookingUseCase,
    GetBookingsUseCase,
    DeleteBookingUseCase,
  ],
})
export class BookingsModule {}