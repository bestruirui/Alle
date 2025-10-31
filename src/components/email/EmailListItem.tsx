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
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <div
        className={`px-4 py-3 cursor-pointer transition-all duration-200 group ${
          isSelected && !isMobile
            ? "bg-primary/10 border-l-4 border-l-primary"
            : "hover:bg-accent border-l-4 border-l-transparent"
        }`}
        onClick={() => onClick(email)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <EmailAvatar
              logo={logo}
              name={email.fromName || ""}
              isSelected={isEmailSelected}
              onClick={(event) => onAvatarToggle(email, event)}
            />
          </div>

          <div className="flex-1 min-w-0 w-0 flex flex-col justify-center">
            <div className="flex flex-col mb-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                  {email.fromName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formattedTime || ""}
                  </span>
                  <EmailActions
                    emailId={email.id}
                    emailName={email.fromName ?? ""}
                    isSelectionMode={isEmailSelected}
                    onDelete={onDelete}
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                {email.subject}
              </div>
            </div>

            <VerificationDisplay email={email} isCopied={isCopied} onCopy={onCopy} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
