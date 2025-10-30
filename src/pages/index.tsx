import { Suspense, useEffect, useTransition, useCallback } from "react";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import { useAuthStore } from "@/lib/store/auth-store";
import { useEmailStore } from "@/lib/store/email-store";
import { useBackgroundResourceManager } from "@/lib/hooks/useBackgroundResourceManager";

function EmailListContainer() {
  const token = useAuthStore((state) => state.token);
  const emails = useEmailStore((state) => state.emails);
  const isLoading = useEmailStore((state) => state.isLoading);
  const isRefreshing = useEmailStore((state) => state.isRefreshing);
  const fetchFromLocal = useEmailStore((state) => state.fetchFromLocal);
  const syncWithRemote = useEmailStore((state) => state.syncWithRemote);
  const deleteEmails = useEmailStore((state) => state.deleteEmails);

  const [isPending, startTransition] = useTransition();

  const handlePageVisible = useCallback(() => {
    if (token) {
      startTransition(() => {
        syncWithRemote(token).catch((error: Error) => {
          if (error.message === "Unauthorized") {
            useAuthStore.getState().logout();
          }
        });
      });
    }
  }, [token, syncWithRemote]);

  useBackgroundResourceManager({
    onPageVisible: handlePageVisible,
  });

  useEffect(() => {
    fetchFromLocal();
    if (token) {
      startTransition(() => {
        syncWithRemote(token).catch((error: Error) => {
          if (error.message === "Unauthorized") {
            useAuthStore.getState().logout();
          }
        });
      });
    }
  }, [token, fetchFromLocal, syncWithRemote]);

  const handleRefresh = () => {
    if (!token) return;
    startTransition(() => {
      syncWithRemote(token).catch(console.error);
    });
  };

  const handleDeleteEmail = async (emailId: number) => {
    if (!token) return;
    await deleteEmails(token, [emailId]);
  };

  const handleBatchDeleteEmails = async (emailIds: number[]) => {
    if (!token) return;
    await deleteEmails(token, emailIds);
  };

  if (isLoading && emails.length === 0) {
    return <LoadingPage />;
  }

  return (
    <EmailList
      emails={emails}
      loading={isRefreshing || isPending}
      onRefresh={handleRefresh}
      onDelete={handleDeleteEmail}
      onBatchDelete={handleBatchDeleteEmails}
    />
  );
}

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const initialize = useAuthStore((state) => state.initialize);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLoginSuccess = (token: string) => {
    login(token);
  };

  if (isInitializing) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <EmailListContainer />
    </Suspense>
  );
}
