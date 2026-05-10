import { create } from 'zustand';
import type { User } from '../types';
import * as storage from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => User | null;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => User | null;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storage.getCurrentUser(),
  isAuthenticated: !!storage.getCurrentUser(),

  login: (email: string, password: string) => {
    const user = storage.login(email, password);
    if (user) {
      set({ user, isAuthenticated: true });
    }
    return user;
  },

  signup: (userData: Omit<User, 'id' | 'createdAt'>) => {
    const user = storage.signup(userData);
    if (user) {
      set({ user, isAuthenticated: true });
    }
    return user;
  },

  logout: () => {
    storage.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updated = storage.updateUser(user.id, updates);
      if (updated) {
        storage.setCurrentUser(updated);
        set({ user: updated });
      }
    }
  },

  refreshUser: () => {
    const user = storage.getCurrentUser();
    set({ user, isAuthenticated: !!user });
  },
}));

// Theme store
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: localStorage.getItem('jobportal_theme') !== 'light',
  toggleTheme: () =>
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('jobportal_theme', newIsDark ? 'dark' : 'light');
      return { isDark: newIsDark };
    }),
}));
