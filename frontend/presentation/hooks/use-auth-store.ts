'use client';

import { create } from 'zustand';
import { User } from '@/shared/types/auth.types';
import { storage } from '@/infrastructure/storage/local-storage';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

/**
 * Global store using zustand
 * 
 * Authentication state management
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  /**
   * Save session after login
   */
  login: (token: string, user: User) => {
    storage.setToken(token);
    storage.setUser(user);
    set({ token, user, isAuthenticated: true });
  },

  /**
   * Logout
   */
  logout: () => {
    storage.clear();
    set({ token: null, user: null, isAuthenticated: false });
  },

  /**
   * Get initial state from localStorage
   * This function is called on app load
   */
  hydrate: () => {
    const token = storage.getToken();
    const user = storage.getUser();

    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },
}));