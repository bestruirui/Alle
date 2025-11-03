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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.4), duration: 0.4, ease: "easeOut" }}
    >
      <div
        className={`cursor-pointer border-l-[5px] px-5 py-4 transition-all duration-300 group relative overflow-hidden ${
          isSelected && !isMobile
            ? "border-l-[var(--memphis-pink)] bg-gradient-to-r from-[var(--memphis-pink)]/15 to-transparent shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)]"
            : "border-l-transparent hover:border-l-[var(--memphis-cyan)] hover:bg-gradient-to-r hover:from-[var(--memphis-cyan)]/8 hover:to-transparent"
        }`}
        onClick={() => onEmailClick(email)}
      >
        {isSelected && !isMobile && (
          <div
            className="absolute left-0 top-0 h-full w-[5px] animate-pulse"
            style={{
              background: "linear-gradient(180deg, var(--memphis-pink), var(--memphis-purple))",
            }}
          />
        )}

        <div className="relative z-10 flex items-start gap-4">
          <div className="flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
            <EmailAvatar
              logo={logo}
              name={email.fromName || ""}
              isSelected={isEmailSelected}
              onClick={(event) => onAvatarToggle(email, event)}
            />
          </div>

          <div className="flex w-0 min-w-0 flex-1 flex-col justify-center">
            <div className="mb-3 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex-1 truncate text-base font-bold text-foreground">
                  {email.fromName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 rounded-md bg-[var(--memphis-yellow)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground border border-[var(--memphis-yellow)]/30">
                    {formattedTime}
                  </span>
                  <EmailActions
                    emailId={email.id}
                    emailName={email.fromName ?? ""}
                    isSelectionMode={isEmailSelected}
                  />
                </div>
              </div>

              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-muted-foreground">
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
