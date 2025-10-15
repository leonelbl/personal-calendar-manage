'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/presentation/hooks/use-auth-store';

/**
 * Provider to initialize auth state
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}