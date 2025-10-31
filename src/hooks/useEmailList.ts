import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchEmailList } from '@/lib/api/email';
import type { EmailList } from '@/types';

interface UseEmailListParams {
  token: string | null;
  limit: number;
}

export function useEmailList({ token, limit }: UseEmailListParams) {
  return useInfiniteQuery<EmailList>({
    queryKey: ['emailList', token, limit],
    queryFn: ({ pageParam = 0 }) => {
      if (!token) {
        throw new Error('No auth token');
      }
      return fetchEmailList(token, { limit, offset: pageParam as number });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.end) {
        return undefined;
      }
      const loadedItems = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return loadedItems;
    },
    initialPageParam: 0,
    enabled: !!token,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchIntervalInBackground: true,
  });
}
