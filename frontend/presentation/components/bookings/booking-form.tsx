'use client';

import { useState } from 'react';
import { CreateBookingDto } from '@/shared/types/booking.types';

interface BookingFormProps {
  onSubmit: (data: CreateBookingDto) => Promise<void>;
  onCancel: () => void;
}

/**
 * Booking form component
 */
export function BookingForm({ onSubmit, onCancel }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    // Complete Date objects
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Validations
    if (!title || !date || !startTime || !endTime) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (startDateTime >= endDateTime) {
      setError('Start time must be before end time');
      setLoading(false);
      return;
    }

    if (startDateTime < new Date()) {
      setError('You cannot create bookings in the past');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        title,
        startTime: startDateTime,
        endTime: endDateTime,
      });
      
      // Reset form
      e.currentTarget.reset();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while creating the booking';      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Minimum date: today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        New Booking
      </h3>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Ej: Meeting with John"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Date */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          min={today}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Start time */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
            Start time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* End time */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
            End time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Creating...' : 'Create Booking'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}