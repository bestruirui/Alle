'use client';

import { useEffect, useRef, RefObject } from 'react';

interface UseVisibilityObserverOptions {
  onVisible?: () => void;
  onHidden?: () => void;
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

export function useVisibilityObserver<T extends Element>(
  options: UseVisibilityObserverOptions = {}
): RefObject<T> {
  const {
    onVisible,
    onHidden,
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible?.();
          } else {
            onHidden?.();
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onVisible, onHidden, threshold, root, rootMargin]);

  return ref;
}

export function usePageVisibility(callback: (isVisible: boolean) => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleVisibilityChange = () => {
      callback(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
}
