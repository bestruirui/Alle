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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`cursor-pointer border-l-4 px-4 py-3 transition-all duration-200 group ${isSelected && !isMobile
          ? "border-l-primary bg-primary/10"
          : "border-l-transparent hover:bg-accent"
          }`}
        onClick={() => onEmailClick(email)}
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

          <div className="flex w-0 min-w-0 flex-1 flex-col justify-center">
            <div className="mb-3 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex-1 truncate text-sm font-semibold text-foreground">
                  {email.fromName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {formattedTime}
                  </span>
                  <EmailActions
                    emailId={email.id}
                    emailName={email.fromName ?? ""}
                    isSelectionMode={isEmailSelected}
                  />
                </div>
              </div>

              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                {email.subject}
              </div>
            </div>

            <VerificationDisplay email={email} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}