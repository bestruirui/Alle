import { useSyncExternalStore } from 'react';

let currentTime = Date.now();
const subscribers = new Set<() => void>();
let rafId: number | null = null;

const startTicker = () => {
  if (rafId !== null || typeof window === 'undefined') return;

  const tick = () => {
    const now = Date.now();
    const isVisible = typeof document !== 'undefined' ? !document.hidden : true;
    const threshold = isVisible ? 1000 : 60000;

    if (now - currentTime >= threshold) {
      currentTime = now;
      subscribers.forEach((callback) => callback());
    }

    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);
};

const stopTicker = () => {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
};

const subscribeTime = (listener: () => void) => {
  subscribers.add(listener);

  if (typeof window !== 'undefined') {
    if (subscribers.size === 1) {
      startTicker();
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && rafId === null) {
        startTicker();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscribers.delete(listener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (subscribers.size === 0) {
        stopTicker();
      }
    };
  }

  return () => {
    subscribers.delete(listener);
  };
};

const getSnapshot = () => currentTime;

export const useCurrentTime = () =>
  useSyncExternalStore(subscribeTime, getSnapshot, getSnapshot);
