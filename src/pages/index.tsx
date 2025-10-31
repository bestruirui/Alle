import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import { ThemeSynchronizer } from "@/components/ThemeSynchronizer";
import { useEmailListInfinite } from "@/lib/hooks/useEmailApi";
import { useEmailStore } from "@/lib/store/email";

function EmailInboxContent({ token }: { token: string }) {
  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } = useEmailListInfinite(token);
  const emails = useEmailStore((state) => state.emails);

  // Sync store with query data
  useEffect(() => {
    if (data) {
      const allEmails = data.pages.flatMap((page) => page.emails);
      const total = data.pages[data.pages.length - 1]?.total || 0;
      const loadedCount = allEmails.length;
      const hasMore = loadedCount < total;
      useEmailStore.getState().setEmails(allEmails, total, hasMore);
    }
  }, [data]);

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <EmailList
      emails={emails}
      loading={isLoading || isFetching}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      hasMore={hasNextPage}
      token={token}
    />
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !authToken) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <main>
      <ThemeSynchronizer />
      <EmailInboxContent token={authToken} />
    </main>
  );
}
