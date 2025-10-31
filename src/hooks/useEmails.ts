import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchEmails, deleteEmails } from "@/lib/api/email";
import { QUERY_KEYS, AUTO_REFRESH_INTERVAL } from "@/const/config";
import type { Email } from "@/types";

interface UseEmailsOptions {
  enabled?: boolean;
  onUnauthorized?: () => void;
}

export function useEmails(token: string | null, options: UseEmailsOptions = {}) {
  const { enabled = true, onUnauthorized } = options;
  const queryClient = useQueryClient();

  const query = useQuery<Email[]>({
    queryKey: [QUERY_KEYS.emails, token],
    queryFn: () => {
      if (!token) throw new Error("No token available");
      return fetchEmails({ token });
    },
    enabled: enabled && !!token,
    refetchInterval: enabled && token ? AUTO_REFRESH_INTERVAL : false,
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "Unauthorized") return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.error instanceof Error && query.error.message === "Unauthorized") {
      onUnauthorized?.();
    }
  }, [query.error, onUnauthorized]);

  const deleteMutation = useMutation({
    mutationFn: (emailIds: number[]) => {
      if (!token) throw new Error("No token available");
      return deleteEmails({ token, emailIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.emails, token] });
    },
  });

  useEffect(() => {
    if (deleteMutation.error instanceof Error && deleteMutation.error.message === "Unauthorized") {
      onUnauthorized?.();
    }
  }, [deleteMutation.error, onUnauthorized]);

  const handleDelete = (emailId: number) => {
    deleteMutation.mutate([emailId]);
  };

  const handleBatchDelete = (emailIds: number[]) => {
    if (emailIds.length === 0) return;
    deleteMutation.mutate(emailIds);
  };

  const isLoading = query.status === "pending";
  const isFetching = query.fetchStatus === "fetching";

  return {
    emails: query.data ?? [],
    isLoading,
    isFetching,
    error: query.error,
    refetch: query.refetch,
    handleDelete,
    handleBatchDelete,
    isDeleting: deleteMutation.isPending,
  };
}
