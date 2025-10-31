import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { Email, ApiResponse } from '@/types';
import { localEmailDB } from '@/lib/db/local';
import { useEmailStore } from '@/lib/store/email';
import { useSettingsStore } from '@/lib/store/settings';

interface FetchEmailsParams {
  token: string;
  limit?: number;
  offset?: number;
}

const fetchEmails = async ({ token, limit = 50, offset = 0 }: FetchEmailsParams) => {
  const response = await fetch(`/api/email/list?limit=${limit}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }

  const data = (await response.json()) as ApiResponse<Email[]>;

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch emails');
  }

  return {
    emails: data.data,
    total: data.total || 0,
  };
};

export const useEmailListInfinite = (token: string | null) => {
  const setOffline = useEmailStore((state) => state.setOffline);
  const { autoRefreshInterval } = useSettingsStore();

  return useInfiniteQuery({
    queryKey: ['emails', token],
    queryFn: async ({ pageParam = 0 }) => {
      if (!token) throw new Error('No token');

      try {
        setOffline(false);
        const result = await fetchEmails({ token, limit: 50, offset: pageParam });

        // Store in local DB
        if (result.emails.length > 0) {
          await localEmailDB.bulkPut(result.emails);
        }

        return {
          emails: result.emails,
          total: result.total,
          nextOffset: pageParam + result.emails.length,
        };
      } catch {
        setOffline(true);
        // Fallback to local DB
        const localEmails = await localEmailDB.list(50, pageParam);
        const localTotal = await localEmailDB.count();
        return {
          emails: localEmails,
          total: localTotal,
          nextOffset: pageParam + localEmails.length,
        };
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + page.emails.length, 0);
      return loadedCount < lastPage.total ? lastPage.nextOffset : undefined;
    },
    initialPageParam: 0,
    enabled: !!token,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5000,
  });
};

export const useDeleteEmail = (token: string | null) => {
  const queryClient = useQueryClient();
  const { removeEmail } = useEmailStore();

  return useMutation({
    mutationFn: async (emailId: number) => {
      if (!token) throw new Error('No token');

      const response = await fetch('/api/email/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([emailId]),
      });

      const data = (await response.json()) as ApiResponse<null>;

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete email');
      }

      return emailId;
    },
    onSuccess: async (emailId) => {
      removeEmail(emailId);
      await localEmailDB.deleteMany([emailId]);
      queryClient.invalidateQueries({ queryKey: ['emails', token] });
    },
  });
};

export const useBatchDeleteEmails = (token: string | null) => {
  const queryClient = useQueryClient();
  const { removeEmails } = useEmailStore();

  return useMutation({
    mutationFn: async (emailIds: number[]) => {
      if (!token) throw new Error('No token');

      const response = await fetch('/api/email/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailIds),
      });

      const data = (await response.json()) as ApiResponse<null>;

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete emails');
      }

      return emailIds;
    },
    onSuccess: async (emailIds) => {
      removeEmails(emailIds);
      await localEmailDB.deleteMany(emailIds);
      queryClient.invalidateQueries({ queryKey: ['emails', token] });
    },
  });
};
