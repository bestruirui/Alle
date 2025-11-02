import { useEffect, useRef } from 'react';
import { localEmailDB } from '@/lib/db/local';
import { useEmailStore } from '@/lib/store/email';

export const useLocalEmailCache = () => {
  const setEmails = useEmailStore((state) => state.setEmails);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const hydrateFromCache = async () => {
      try {
        const cachedEmails = await localEmailDB.list(50, 0);
        const cachedTotal = await localEmailDB.count();

        if (cachedEmails.length > 0) {
          setEmails(cachedEmails, cachedTotal, cachedTotal > 50);
        }
      } catch (error) {
        console.error('Failed to load cached emails:', error);
      }
    };

    hydrateFromCache();
  }, [setEmails]);
};
