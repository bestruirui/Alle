"use client";

import { useMemo, type MouseEvent } from "react";
import { useDevice } from "@/provider/Device";
import { getProviderLogo } from "@/lib/utils/logo";
import { useFormatTime } from "@/lib/hooks/useFormatTime";
import type { Email } from "@/types";
import { EmailAvatar } from "@/components/email/list/EmailAvatar";
import { EmailActions } from "@/components/email/list/EmailActions";
import { VerificationDisplay } from "@/components/email/list/VerificationDisplay";

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  isEmailSelected: boolean;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onClick: (email: Email) => void;
  onDelete?: (emailId: number) => void;
  onAvatarToggle: (email: Email, event: MouseEvent) => void;
}

export function EmailListItem({
  email,
  isSelected,
  isEmailSelected,
  copiedId,
  onCopy,
  onClick,
  onDelete,
  onAvatarToggle,
}: EmailListItemProps) {
  const { isMobile } = useDevice();
  const formatTime = useFormatTime();

  const logo = useMemo(() => getProviderLogo(email.fromAddress), [email.fromAddress]);
  const formattedTime = useMemo(() => formatTime(email.sentAt), [formatTime, email.sentAt]);

  const isCopied = (id: string) => copiedId === id;

  return (
    <div
      className={`cursor-pointer border-l-4 px-4 py-3 transition-all duration-200 group ${
        isSelected && !isMobile
          ? "border-l-primary bg-primary/10"
          : "border-l-transparent hover:bg-accent"
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
                  onDelete={onDelete}
                />
              </div>
            </div>

            <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
              {email.subject}
            </div>
          </div>

          <VerificationDisplay email={email} isCopied={isCopied} onCopy={onCopy} />
        </div>
      </div>
    </div>
  );
}
