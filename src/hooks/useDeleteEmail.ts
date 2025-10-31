import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmails } from '@/lib/api/email';
import type { EmailList } from '@/types';
import type { InfiniteData } from '@tanstack/react-query';

interface DeleteEmailParams {
  token: string;
  emailIds: number[];
}

export function useDeleteEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, emailIds }: DeleteEmailParams) => deleteEmails(token, emailIds),
    onSuccess: (_, { emailIds }) => {
      queryClient.setQueriesData<InfiniteData<EmailList>>(
        { queryKey: ['emailList'] },
        (old) => {
          if (!old) return old;

          const removedIdSet = new Set(emailIds);
          let removedCount = 0;

          const pages = old.pages.map((page) => {
            const filteredItems = page.items.filter((email) => {
              const shouldKeep = !removedIdSet.has(email.id);
              if (!shouldKeep) {
                removedCount += 1;
              }
              return shouldKeep;
            });

            return {
              ...page,
              items: filteredItems,
            };
          });

          const newTotal = Math.max(0, (pages[0]?.total ?? 0) - removedCount);

          return {
            ...old,
            pages: pages.map((page) => ({
              ...page,
              total: newTotal,
            })),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ['emailList'] });
    },
  });
}
