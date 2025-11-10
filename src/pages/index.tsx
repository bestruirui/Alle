import LoadingPage from "@/components/LoadingPage";
import LoginPage from "@/components/LoginPage";
import EmailList from "@/components/email/EmailList";
import useAuthStore from "@/lib/store/auth";

import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, setToken, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    setIsLoading(false);
  }, [initAuth]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !token) {
    return <LoginPage onLoginSuccess={setToken} />;
  }

  return <EmailList />;
}
