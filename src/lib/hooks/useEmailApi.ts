import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEmailStore } from '@/lib/store/email';
import { useSettingsStore } from '@/lib/store/settings';
import * as emailApi from '@/lib/api/email';

export const useEmailListInfinite = () => {
  const { autoRefreshInterval } = useSettingsStore();

  return useInfiniteQuery({
    queryKey: ['emails'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await emailApi.fetchEmails(50, pageParam);

      return {
        emails: result.emails,
        total: result.total,
        nextOffset: pageParam + result.emails.length,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + page.emails.length, 0);
      return loadedCount < lastPage.total ? lastPage.nextOffset : undefined;
    },
    initialPageParam: 0,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5000,
  });
};

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  const { removeEmail } = useEmailStore();

  return useMutation({
    mutationFn: emailApi.deleteEmail,
    onSuccess: (emailId) => {
      removeEmail(emailId);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
};

export const useBatchDeleteEmails = () => {
  const queryClient = useQueryClient();
  const { removeEmails } = useEmailStore();

  return useMutation({
    mutationFn: emailApi.batchDeleteEmails,
    onSuccess: (emailIds) => {
      removeEmails(emailIds);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
};
