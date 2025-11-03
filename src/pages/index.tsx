import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoginPage from "@/components/LoginPage";
import LoadingPage from "@/components/LoadingPage";
import EmailList from "@/components/email/EmailList";
import { useAuthStore } from "@/lib/store/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, setToken, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    setIsLoading(false);
  }, [initAuth]);

  if (isLoading) {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingPage />
      </motion.div>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoginPage onLoginSuccess={setToken} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="email-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <EmailList />
    </motion.div>
  );
}
