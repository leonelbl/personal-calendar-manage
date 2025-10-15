import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * DTO for creating a booking
 */
export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string; // ISO string

  @IsDateString()
  @IsNotEmpty()
  endTime: string; // ISO string
}

/**
 * DTO for booking response
 */
export class BookingResponseDto {
  id: string;
  userId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}