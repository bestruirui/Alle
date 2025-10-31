import { useState, useEffect, useMemo } from "react";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import { useEmailList } from "@/hooks/useEmailList";
import { useDeleteEmail } from "@/hooks/useDeleteEmail";

export default function Home() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const limit = 20;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useEmailList({ token: authToken, limit });

  const deleteMutation = useDeleteEmail();

  const allEmails = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
    }
    setIsCheckingAuth(false);
  }, []);

  // 登录成功回调
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("auth_token", token);
    setAuthToken(token);
  };

  // 刷新邮件列表
  const handleRefresh = () => {
    refetch();
  };

  // 删除单个邮件
  const handleDeleteEmail = (emailId: number) => {
    if (!authToken) return;
    deleteMutation.mutate({ token: authToken, emailIds: [emailId] });
  };

  // 批量删除邮件
  const handleBatchDeleteEmails = (emailIds: number[]) => {
    if (!authToken) return;
    deleteMutation.mutate({ token: authToken, emailIds });
  };

  // 加载更多
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 显示加载页面
  if (isCheckingAuth) {
    return <LoadingPage />;
  }

  // 显示登录页面
  if (!authToken) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 显示邮件列表
  return (
    <EmailList
      emails={allEmails}
      loading={isLoading}
      onRefresh={handleRefresh}
      onDelete={handleDeleteEmail}
      onBatchDelete={handleBatchDeleteEmails}
      hasMore={hasNextPage}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
    />
  );
}
