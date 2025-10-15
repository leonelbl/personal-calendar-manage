export interface Booking {
  id: string;
  userId: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  title: string;
  startTime: Date;
  endTime: Date;
}