"use client";

import { motion } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function EmailListEmpty({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <Mail className="h-10 w-10 text-muted-foreground" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {t("noEmails")}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="text-sm text-muted-foreground max-w-sm mb-6"
      >
        {t("noEmailsDesc")}
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex"
      >
        <Button
          onClick={() => {
            void onRefresh();
          }}
          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refreshEmails")}
        </Button>
      </motion.div>
    </motion.div>
  );
}
