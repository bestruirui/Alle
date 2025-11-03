import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/EmailList";
import { useAuthStore } from "@/lib/store/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, setToken, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    setIsLoading(false);
  }, [initAuth]);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <EmailList />;
}
