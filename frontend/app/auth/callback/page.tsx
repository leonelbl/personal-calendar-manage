'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/presentation/hooks/use-auth-store';

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

  useEffect(() => {
    // Get token from URL
    const token = searchParams.get('token');

    if (!token) {
      console.error('No token found in URL');
      router.push('/auth/error');
      return;
    }

    try {
      // Decode the JWT payload (just to get user data)
      // Note: We're not validating, just reading public data
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Create user object from payload
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.email.split('@')[0], // Temporal, idealmente viene del backend
        picture: undefined,
      };

      // Save to store (and localStorage)
      login(token, user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error processing token:', error);
      router.push('/auth/error');
    }
  }, [searchParams, login, router]);

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