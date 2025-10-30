import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import type { Email, ApiResponse } from "@/types";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      fetchEmails(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 获取邮件列表
  const fetchEmails = async (token: string) => {
    try {
      const response = await fetch("/api/email/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as ApiResponse<Email[]>;

      if (data.success && data.data) {
        setEmails(data.data);
      } else if (response.status === 401) {
        // Token 过期,清除登录状态
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
        setAuthToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 登录成功回调
  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    setIsLoading(true);
    fetchEmails(token);
  };

  // 刷新邮件列表
  const handleRefresh = () => {
    if (!authToken) return;
    setRefreshing(true);
    fetch("/api/email/list", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json() as Promise<ApiResponse<Email[]>>)
      .then((data) => {
        if (data.success && data.data) {
          setEmails(data.data);
        }
      })
      .catch((error) => {
        console.error("Failed to refresh emails:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  // 删除单个邮件
  const handleDeleteEmail = async (emailId: number) => {
    if (!authToken) return;
    
    try {
      const response = await fetch("/api/email/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify([emailId]),
      });

      const data = await response.json() as ApiResponse<null>;
      
      if (data.success) {
        // 从本地状态中移除已删除的邮件
        setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
      } else {
        console.error("Failed to delete email:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete email:", error);
    }
  };

  // 批量删除邮件
  const handleBatchDeleteEmails = async (emailIds: number[]) => {
    if (!authToken || emailIds.length === 0) return;
    
    try {
      const response = await fetch("/api/email/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(emailIds),
      });

      const data = await response.json() as ApiResponse<null>;
      
      if (data.success) {
        // 从本地状态中移除已删除的邮件
        setEmails(prevEmails => prevEmails.filter(email => !emailIds.includes(email.id)));
      } else {
        console.error("Failed to delete emails:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete emails:", error);
    }
  };

  // 显示加载页面
  if (isLoading) {
    return <LoadingPage />;
  }

  // 显示登录页面
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 显示邮件列表
  return (
    <EmailList 
      emails={emails} 
      loading={refreshing} 
      onRefresh={handleRefresh}
      onDelete={handleDeleteEmail}
      onBatchDelete={handleBatchDeleteEmails}
    />
  );
}
