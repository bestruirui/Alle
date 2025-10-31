"use client";

import { motion } from "framer-motion";
import { useMemo, type MouseEvent } from "react";
import { useDevice } from "@/provider/Device";
import { getProviderLogo } from "@/lib/utils/logo";
import type { Email } from "@/types";
import { EmailAvatar } from "@/components/email/list/EmailAvatar";
import { EmailActions } from "@/components/email/list/EmailActions";
import { VerificationDisplay } from "@/components/email/list/VerificationDisplay";

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  isEmailSelected: boolean;
  formattedTime?: string;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onClick: (email: Email) => void;
  onDelete?: (emailId: number) => void;
  onAvatarToggle: (email: Email, event: MouseEvent) => void;
}

export function EmailListItem({
  email,
  index,
  isSelected,
  isEmailSelected,
  formattedTime,
  copiedId,
  onCopy,
  onClick,
  onDelete,
  onAvatarToggle,
}: EmailListItemProps) {
  const { isMobile } = useDevice();

  const logo = useMemo(() => getProviderLogo(email.fromAddress), [email.fromAddress]);
  const isCopied = (id: string) => copiedId === id;

  return (
    <motion.article
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="px-4 py-3 transition-all duration-200"
    >
      <button
        type="button"
        onClick={() => onClick(email)}
        className={`flex w-full items-start gap-3 text-left rounded-xl ${
          isSelected && !isMobile ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-accent border-l-4 border-l-transparent"
        }`}
      >
        <div className="flex-shrink-0">
          <EmailAvatar logo={logo} name={email.fromName || ""} isSelected={isEmailSelected} onClick={(event) => onAvatarToggle(email, event)} />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <header className="flex items-center gap-2">
            <h3 className="flex-1 truncate text-sm font-semibold text-foreground">{email.fromName}</h3>
            {formattedTime && <span className="text-xs text-muted-foreground">{formattedTime}</span>}
            <EmailActions emailId={email.id} emailName={email.fromName ?? ""} isSelectionMode={isEmailSelected} onDelete={onDelete} />
          </header>

          <p className="truncate text-xs text-muted-foreground">{email.subject}</p>

          <VerificationDisplay email={email} isCopied={isCopied} onCopy={onCopy} />
        </div>
      </button>
    </motion.article>
  );
}
