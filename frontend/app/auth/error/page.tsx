'use client';

import { useRouter } from 'next/navigation';

/**
 * Authentication error page
 *
 * This page is shown when something goes wrong during the login process
 */
export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        {/* Error icon */}
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

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Error
        </h2>
        
        <p className="text-gray-600 mb-6">
          There was a problem signing in with Google. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = 'mailto:support@example.com'}
            className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Possible causes */}
        <div className="mt-8 text-left">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Possible causes:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>You did not authorize all necessary permissions</li>
            <li>Server connection issue</li>
            <li>Your Google account does not have access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}