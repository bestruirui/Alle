import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  autoRefreshInterval: number;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setAutoRefreshInterval: (interval: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'zh',
      autoRefreshInterval: 30000,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setAutoRefreshInterval: (interval) => set({ autoRefreshInterval: interval }),
    }),
    {
      name: 'alle-settings',
    }
  )
);
