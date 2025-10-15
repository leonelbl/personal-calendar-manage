'use client';

import { useState, useEffect } from 'react';
import { bookingsApi } from '@/infrastructure/api/bookings.api';
import { Booking, CreateBookingDto } from '@/shared/types/booking.types';

/**
 * Custom Hook to manage bookings
 * Provides state and functions to interact with bookings
 */
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load bookings from the backend
   */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new booking
   */
  const createBooking = async (data: CreateBookingDto) => {
    try {
      setError(null);
      const newBooking = await bookingsApi.create(data);
      setBookings((prev) => [...prev, newBooking]);
      return newBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error creating booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Delete a booking
   */
  const deleteBooking = async (id: string) => {
    try {
      setError(null);
      await bookingsApi.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error deleting booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    deleteBooking,
  };
}