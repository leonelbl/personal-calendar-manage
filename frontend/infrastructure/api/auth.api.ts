import { apiClient } from './axios-client';
import { User } from '@/shared/types/auth.types';

/**
 * API Client for authentication
 */
export const authApi = {
  /**
   * Get authenticated user info
   * Requires valid JWT in Authorization header
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },
};