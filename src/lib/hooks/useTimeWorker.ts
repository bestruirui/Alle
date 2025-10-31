import { useEffect, useRef } from 'react';
import { useEmailStore } from '@/lib/store/email';
import { useSettingsStore } from '@/lib/store/settings';
import type { Email } from '@/types';

let workerInstance: Worker | null = null;

const getWorker = () => {
  if (!workerInstance && typeof window !== 'undefined') {
    workerInstance = new Worker('/time-worker.js');
  }
  return workerInstance;
};

export const useTimeWorker = (emails: Email[]) => {
  const { updateFormattedTimes } = useEmailStore();
  const { language } = useSettingsStore();
  const timeoutRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!emails.length) return;

    const worker = getWorker();
    if (!worker) return;

    const updateTimes = () => {
      const now = Date.now();
      // Only update every 10 seconds minimum
      if (now - lastUpdateRef.current < 10000) return;

      lastUpdateRef.current = now;
      worker.postMessage({
        type: 'FORMAT_TIMES',
        emails,
        now,
        language,
      });
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'FORMATTED_TIMES') {
        updateFormattedTimes(e.data.data);
      }
    };

    worker.addEventListener('message', handleMessage);

    // Initial update
    updateTimes();

    // Update every minute using RAF for better performance
    const scheduleUpdate = () => {
      timeoutRef.current = window.setTimeout(() => {
        updateTimes();
        scheduleUpdate();
      }, 60000);
    };

    scheduleUpdate();

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      worker.removeEventListener('message', handleMessage);
    };
  }, [emails, language, updateFormattedTimes]);
};
