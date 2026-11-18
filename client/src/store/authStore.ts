import { create } from 'zustand';
import api from '../lib/api';
import type { AuthResponse, AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verify: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email, password) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    set({ user: data.user, loading: false });
  },

  signUp: async (name, email, password) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    set({ user: data.user, loading: false });
  },

  signOut: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, loading: false });
    }
  },

  verify: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<AuthResponse>('/auth/me');
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
