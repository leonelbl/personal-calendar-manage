export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}