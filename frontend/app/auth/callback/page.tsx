'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/presentation/hooks/use-auth-store';
import { storage } from '@/infrastructure/storage/local-storage';
import { authApi } from '@/infrastructure/api/auth.api';

/**
 * Callback page for Google OAuth
 *
 * Google redirects here after authorizing with the token in the URL.
 * This page extracts the token, saves it, and redirects to the dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // 1. Get token from URL
        const token = searchParams.get('token');

        if (!token) {
          console.error('No token found in URL');
          router.push('/auth/error');
          return;
        }

        // 2. Save token temporarily in localStorage
        // (the axios interceptor will use it for the next request)
        storage.setToken(token);

        // 3. Get complete user data from backend
        const userData = await authApi.getMe();

        // 4. Save in global store (and update localStorage)
        login(token, userData);

        // 5. Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error processing authentication:', err);
        setError('Error processing authentication');

        // Clear invalid token
        storage.removeToken();

        // Redirect to error after 2 seconds
        setTimeout(() => {
          router.push('/auth/error');
        }, 2000);
      }
    };

    processAuth();
  }, [searchParams, login, router]);

   if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error}
          </h2>
          <p className="text-gray-500">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Loading spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Signing in...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}