"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProviderLogo, formatTime } from "@/lib/utils/utils";
import type { Email } from "@/lib/db/email";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  id: string | number;
}

function CopyButton({ text, copiedId, setCopiedId, id }: CopyButtonProps) {
  const copied = copiedId === String(id);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-xl transition-all duration-200 border-border"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(String(id));
        setTimeout(() => setCopiedId(null), 2000);
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3.5 w-3.5 text-chart-2" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  onClick: (email: Email) => void;
}

export function EmailListItem({
  email,
  index,
  isSelected,
  copiedId,
  setCopiedId,
  onClick
}: EmailListItemProps) {
  const logo = getProviderLogo(email.fromAddress);

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <div
        className={`px-6 py-5 cursor-pointer transition-all duration-200 ${isSelected
          ? "bg-primary/10 border-l-4 border-l-primary"
          : "hover:bg-accent border-l-4 border-l-transparent"
          }`}
        onClick={() => onClick(email)}
      >
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ? (
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-sm overflow-hidden">
                <Image src={logo} alt="" width={32} height={32} className="object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                <span className="text-primary font-semibold text-lg">
                  {email.fromName?.[0] || "?"}
                </span>
              </div>
            )}
          </div>

          {/* 内容区 */}
          <div className="flex-1 min-w-0 w-0">
            {/* 发件人和时间 */}
            <div className="flex items-start justify-between mb-2 gap-2">
              <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                {email.fromName}
              </h3>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTime(email.receivedAt)}
              </span>
            </div>

            <div className="text-xs text-muted-foreground mb-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
              {email.subject}
            </div>
            {/* 链接预览 */}
            {email.verificationType === 'link' && email.verificationLink && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20">
                <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  {email.verificationLink}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl transition-all duration-200"
                    asChild
                  >
                    <a
                      href={email.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <CopyButton
                    text={email.verificationLink}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    id={`list-link-${email.id}`}
                  />
                </div>
              </div>
            )}

            {/* 验证码预览 */}
            {email.verificationType === 'code' && email.verificationCode && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
                  {email.verificationCode}
                </span>
                <div className="flex items-center">
                  <CopyButton
                    text={email.verificationCode}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    id={`list-code-${email.id}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}