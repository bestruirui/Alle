import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import { useAuth } from "@/hooks/useAuth";
import { useEmails } from "@/hooks/useEmails";

export default function Home() {
  const { token, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();

  const {
    emails,
    isLoading: emailsLoading,
    isFetching,
    refetch,
    handleDelete,
    handleBatchDelete,
  } = useEmails(token, {
    enabled: isAuthenticated,
    onUnauthorized: logout,
  });

  const handleRefresh = () => {
    refetch();
  };

  if (authLoading || (isAuthenticated && emailsLoading)) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  return (
    <EmailList
      emails={emails}
      loading={isFetching}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
      onBatchDelete={handleBatchDelete}
    />
  );
}
