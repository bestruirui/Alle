'use client';

import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  initialize: () => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
  initialize: () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        set({ token, isAuthenticated: true, isInitializing: false });
      } else {
        set({ isInitializing: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth store:', error);
      set({ isInitializing: false, error: 'Failed to initialize authentication.' });
    }
  },
  login: (token) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      set({ token, isAuthenticated: true, error: null });
    } catch (error) {
      console.error('Failed to persist auth token:', error);
      set({ error: 'Failed to persist authentication token.' });
    }
  },
  logout: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
    set({ token: null, isAuthenticated: false });
  },
}));
