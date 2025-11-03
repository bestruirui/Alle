"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailContent } from "@/components/email/EmailContent";
import { getProviderLogo } from "@/lib/utils/logo";
import type { Email } from "@/types";

export function EmailDetail({ email }: { email: Email | null }) {
  if (!email) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <motion.div
            className="absolute top-[25%] left-[30%] w-20 h-20 rounded-full border-[6px] border-[var(--memphis-cyan)]"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[30%] right-[25%] w-16 h-16"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "var(--memphis-yellow)",
            }}
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center p-12 text-center">
          <motion.div
            className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--memphis-pink)] to-[var(--memphis-purple)] border-[5px] border-foreground shadow-[8px_8px_0_var(--memphis-cyan)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Mail className="h-14 w-14 text-white" />
          </motion.div>
          <h3 className="mb-3 text-2xl font-black uppercase tracking-wider text-foreground">
            选择一封邮件
          </h3>
          <p className="max-w-sm text-base font-medium text-muted-foreground">
            从左侧列表中选择一封邮件以查看详细内容
          </p>
        </div>
      </div>
    );
  }

  const logo = getProviderLogo(email.fromAddress);

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
    <div className="flex h-full flex-col">
      <div className="relative flex-shrink-0 border-b-[4px] border-border bg-card/98 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div
            className="absolute top-4 right-12 w-8 h-8 rounded-full border-[3px] border-[var(--memphis-pink)]"
            style={{ animation: "memphisPulse 3s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-3 left-10 w-24 h-[2px]"
            style={{
              background: "repeating-linear-gradient(90deg, var(--memphis-cyan) 0, var(--memphis-cyan) 8px, transparent 8px, transparent 16px)",
            }}
          />
        </div>

        <div className="relative z-10 p-8">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-5">
              {logo ? (
                <motion.div
                  className="flex-shrink-0 overflow-hidden rounded-2xl border-[4px] border-border bg-muted shadow-[6px_6px_0_var(--memphis-yellow)]"
                  style={{ width: 64, height: 64 }}
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image src={logo} alt="" width={56} height={56} className="object-contain" />
                </motion.div>
              ) : (
                <motion.div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-[4px] border-border bg-gradient-to-br from-[var(--memphis-pink)] to-[var(--memphis-purple)] shadow-[6px_6px_0_var(--memphis-yellow)]"
                  whileHover={{ scale: 1.08, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-3xl font-black text-white">
                    {email.fromName?.[0] || "?"}
                  </span>
                </motion.div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="mb-1 truncate text-2xl font-black text-foreground">
                  {email.fromName}
                </h2>
                <p className="mb-3 truncate text-sm font-semibold text-muted-foreground">
                  {email.fromAddress}
                </p>
                <div className="flex items-center gap-2 rounded-lg bg-[var(--memphis-yellow)]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground w-fit border-[2px] border-[var(--memphis-yellow)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatFullTime(email.sentAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative inline-block">
            <h3 className="text-lg font-bold leading-relaxed text-foreground">
              {email.subject}
            </h3>
            <div
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded"
              style={{
                background: "linear-gradient(90deg, var(--memphis-cyan), var(--memphis-purple))",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <div className="memphis-pattern-dots absolute inset-0" />
        </div>
        <ScrollArea className="h-full">
          <div className="relative z-10 space-y-6 p-8">
            <EmailContent bodyHtml={email.bodyHtml} bodyText={email.bodyText} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
