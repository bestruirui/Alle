"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useDevice } from "@/provider/Device";
import { getProviderLogo } from "@/lib/utils/logo";
import { useFormatTime } from "@/lib/hooks/useFormatTime";
import type { Email } from "@/types";
import { EmailAvatar } from "@/components/email/EmailAvatar";
import { EmailActions } from "@/components/email/EmailActions";
import { VerificationDisplay } from "@/components/email/VerificationDisplay";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  isEmailSelected: boolean;
}

export function EmailListItem({
  email,
  index,
  isSelected,
  isEmailSelected,
}: EmailListItemProps) {
  const { isMobile } = useDevice();
  const formatTime = useFormatTime();
  const { onEmailClick, onAvatarToggle } = useEmailListInteractions();

  const logo = useMemo(() => getProviderLogo(email.fromAddress), [email.fromAddress]);
  const formattedTime = useMemo(() => formatTime(email.sentAt), [formatTime, email.sentAt]);

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.3 }}
    >
      <div
        className={`group relative cursor-pointer rounded-[1.75rem] border-2 px-5 py-4 transition-all duration-300 ease-out backdrop-blur-sm hover:-translate-y-1 ${
          isSelected && !isMobile
            ? "border-primary bg-primary/15 shadow-[0_14px_0_rgba(255,92,141,0.2)]"
            : "border-transparent bg-card shadow-[0_10px_0_rgba(36,17,61,0.12)] hover:border-primary hover:shadow-[0_14px_0_rgba(124,108,255,0.18)]"
        }`}
        onClick={() => onEmailClick(email)}
      >
        <span className="pointer-events-none absolute left-6 top-4 h-2 w-10 rounded-full bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <EmailAvatar
              logo={logo}
              name={email.fromName || ""}
              isSelected={isEmailSelected}
              onClick={(event) => onAvatarToggle(email, event)}
            />
          </div>

          <div className="flex w-0 min-w-0 flex-1 flex-col justify-center gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex-1 truncate text-base font-black text-foreground">
                  {email.fromName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 rounded-full bg-secondary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary-foreground">
                    {formattedTime}
                  </span>
                  <EmailActions
                    emailId={email.id}
                    emailName={email.fromName ?? ""}
                    isSelectionMode={isEmailSelected}
                  />
                </div>
              </div>

              <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground opacity-80">
                {email.subject}
              </p>
            </div>

            <VerificationDisplay email={email} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
