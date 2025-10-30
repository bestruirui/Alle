'use client';

import { useEffect, useCallback } from 'react';
import { usePageVisibility } from './useVisibilityObserver';
import { timeFormatterWorkerClient } from '../services/time-formatter';

interface BackgroundResourceManagerOptions {
  onPageVisible?: () => void;
  onPageHidden?: () => void;
}

export function useBackgroundResourceManager(options: BackgroundResourceManagerOptions = {}) {
  const {
    onPageVisible,
    onPageHidden,
  } = options;

  const handleVisibilityChange = useCallback(
    (isVisible: boolean) => {
      if (isVisible) {
        timeFormatterWorkerClient.setReferenceTime(Date.now());
        onPageVisible?.();
      } else {
        onPageHidden?.();
      }
    },
    [onPageVisible, onPageHidden]
  );

  usePageVisibility(handleVisibilityChange);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('last_active', Date.now().toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
