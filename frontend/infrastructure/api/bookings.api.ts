import { apiClient } from './axios-client';
import { Booking, CreateBookingDto } from '@/shared/types/booking.types';

/**
 * API bookings manager
 * 
 * JWT token is automatically included in requests
 * (configured in axios-client interceptor)
 */
export const bookingsApi = {
  /**
   * Get all user bookings
   */
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  /**
   * Create a new booking
   */
  create: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await apiClient.post('/bookings', {
      title: data.title,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    });
    return response.data;
  },

  /**
   * Delete a booking
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};