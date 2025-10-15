'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/presentation/hooks/use-auth-store';
import { useBookings } from '@/presentation/hooks/use-bookings';
import { BookingsList } from '@/presentation/components/bookings/bookings-list';
import { BookingForm } from '@/presentation/components/bookings/booking-form';
import { Plus } from 'lucide-react';

/**
 * Dashboard Page
 *
 * Displays and manages all user bookings
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { bookings, loading, error, createBooking, deleteBooking } = useBookings();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCreateBooking = async (data: any) => {
    await createBooking(data);
    setShowForm(false);
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
    } catch (err) {
      alert('Error deleting booking');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                My Bookings
              </h1>
              {!loading && (
                <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              {/* Avatar */}
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Button to show form */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Booking
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-6">
            <BookingForm
              onSubmit={handleCreateBooking}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Bookings list */}
        <BookingsList
          bookings={bookings}
          loading={loading}
          onDelete={handleDeleteBooking}
        />
      </main>
    </div>
  );
}