"use client";

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store/settings';
import { useTheme } from 'next-themes';

export function ThemeSynchronizer() {
  const theme = useSettingsStore((state) => state.theme);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
