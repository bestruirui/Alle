'use client';

import { useEffect } from 'react';
import type { Email } from '@/types';

interface PreloadOptions {
  enabled?: boolean;
  delay?: number;
  maxItems?: number;
}

export function usePreloadImages(emails: Email[], options: PreloadOptions = {}) {
  const { enabled = true, delay = 500, maxItems = 10 } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const emailsToPreload = emails.slice(0, maxItems);
      
      emailsToPreload.forEach((email) => {
        if (email.bodyHtml) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(email.bodyHtml, 'text/html');
          const images = doc.querySelectorAll('img');
          
          images.forEach((img) => {
            const src = img.getAttribute('src');
            if (src) {
              const image = new Image();
              image.src = src;
            }
          });
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [emails, enabled, delay, maxItems]);
}

export function usePreloadEmailData(emailIds: number[], options: PreloadOptions = {}) {
  const { enabled = true, delay = 1000 } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || emailIds.length === 0) return;

    const timer = setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/api/email/list`;
      document.head.appendChild(link);

      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }, delay);

    return () => clearTimeout(timer);
  }, [emailIds, enabled, delay]);
}
