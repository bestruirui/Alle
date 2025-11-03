"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailContent } from "@/components/email/EmailContent";
import { getProviderLogo } from "@/lib/utils/logo";
import type { Email } from "@/types";

export function EmailDetail({ email }: { email: Email | null }) {
  if (!email) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center h-full w-full"
      >
        <div className="flex flex-col items-center text-center p-8">
          <motion.div 
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            选择一封邮件
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-sm text-muted-foreground max-w-sm"
          >
            从左侧列表中选择一封邮件以查看详细内容
          </motion.p>
        </div>
      </motion.div>
    );
  }

  const logo = getProviderLogo(email.fromAddress);

  // 格式化完整时间
  const formatFullTime = (sentAt: string | null): string => {
    if (!sentAt) return '';
    const date = new Date(sentAt);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div 
      key={email.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full"
    >
      {/* 头部 */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Logo */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0"
              >
                {logo ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-sm">
                    <Image src={logo} alt="" width={36} height={36} className="object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                    <span className="text-primary font-bold text-2xl">
                      {email.fromName?.[0] || "?"}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* 发件人信息 */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="flex-1 min-w-0"
              >
                <h2 className="text-xl font-bold text-foreground mb-1 truncate">
                  {email.fromName}
                </h2>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {email.fromAddress}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatFullTime(email.sentAt)}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* 主题 */}
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-base font-semibold text-foreground mb-4 leading-relaxed"
          >
            {email.subject}
          </motion.h3>
        </div>
      </div>

      {/* 内容区域 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="flex-1 min-h-0"
      >
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* 邮件正文 */}
            <EmailContent
              bodyHtml={email.bodyHtml}
              bodyText={email.bodyText}
            />
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
