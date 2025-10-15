'use client';

import { Booking } from '@/shared/types/booking.types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Trash2, Calendar, Clock } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

/**
 * Booking card component
 */
export function BookingCard({ booking, onDelete }: BookingCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this booking?')) {
      onDelete(booking.id);
    }
  };

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {booking.title}
          </h3>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {format(startDate, "MMMM d, yyyy", { locale: enUS })}
            </span>
          </div>

          {/* Schedule */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete booking"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Duration badge */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} min
        </span>
      </div>
    </div>
  );
}