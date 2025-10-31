"use client";

import Image from "next/image";
import { Mail, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailContent } from "@/components/email/EmailContent";
import { formatTime } from "@/lib/utils/utils";
import { getProviderLogo } from "@/lib/utils/logo";
import type { Email } from "@/types";

interface EmailDetailProps {
  email: Email | null;
  onClose?: () => void;
}

export function EmailDetail({ email, onClose }: EmailDetailProps) {
  if (!email) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Mail className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">选择一封邮件</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            从左侧列表中选择一封邮件以查看详细内容
          </p>
        </div>
      </div>
    );
  }

  const logo = getProviderLogo(email.fromAddress);

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Logo */}
              <div className="flex-shrink-0">
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
              </div>

              {/* 发件人信息 */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground mb-1 truncate">
                  {email.fromName}
                </h2>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {email.fromAddress}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTime(email.sentAt)}</span>
                </div>
              </div>
            </div>

            {/* 关闭按钮（仅移动端） */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden h-10 w-10 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* 主题 */}
          <h3 className="text-base font-semibold text-foreground mb-4 leading-relaxed">
            {email.subject}
          </h3>
        </div>
      </div>

      {/* 内容区域 */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* 邮件正文 */}
          <EmailContent
            bodyHtml={email.bodyHtml}
            bodyText={email.bodyText}
          />
        </div>
      </ScrollArea>
    </div>
  );
}