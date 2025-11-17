"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useDevice } from "@/provider/Device";
import { CheckSquare } from "lucide-react";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";
import useFormatTime from "@/lib/hooks/useFormatTime";
import EmailAvatar from "@/components/email/EmailAvatar";
import EmailActions from "@/components/email/EmailActions";
import VerificationDisplay from "@/components/email/VerificationDisplay";
import { cn } from "@/lib/utils/utils";
import type { Email } from "@/types";

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  isEmailSelected: boolean;
}

export default function EmailListItem({
  email,
  index,
  isSelected,
  isEmailSelected,
}: EmailListItemProps) {
  const { isMobile } = useDevice();
  const formatTime = useFormatTime();
  const { onEmailClick, onAvatarToggle } = useEmailListInteractions();

  const formattedTime = useMemo(() => formatTime(email.sentAt), [formatTime, email.sentAt]);
  const isRead = email.readStatus === 1;
  const isUnread = !isRead;

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.3 }}
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
            <AnimatePresence mode="wait">
              {isEmailSelected ? (
                <motion.div
                  key="checkbox"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-primary/10 border border-primary cursor-pointer"
                  onClick={(event) => onAvatarToggle(email, event)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckSquare className="text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="avatar"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={(event) => onAvatarToggle(email, event)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <EmailAvatar
                    name={email.fromName || ""}
                    fromAddress={email.fromAddress}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex w-0 min-w-0 flex-1 flex-col justify-center">
            <div className="mb-3 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={cn(
                    "flex-1 truncate text-sm",
                    isUnread ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                  )}
                >
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
                {email.title}
              </div>
            </div>

            <VerificationDisplay email={email} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}