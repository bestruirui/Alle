"use client";

import type { MouseEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";
import CopyButton from "@/components/common/CopyButton";
import getEmailTypeStyle from "@/lib/constants/emailTypes";
import { useMarkEmail } from "@/lib/hooks/useEmailApi";
import type { Email } from "@/types";

export default function VerificationDisplay({ email }: { email: Email }) {
  const { copiedId, onCopy } = useEmailListInteractions();
  const { mutate: markEmail } = useMarkEmail();

  if (!email.emailResult || email.emailType === "none") {
    return null;
  }

  const config = getEmailTypeStyle(email.emailType);
  const copyId = `list-result-${email.id}`;
  const isCopied = copiedId === copyId;

  const markAsRead = () => {
    if (email.readStatus === 1) {
      return;
    }
    markEmail({ emailId: email.id, isRead: true });
  };

  const handleCopy = () => {
    markAsRead();
    onCopy(copyId);
  };

  const handleOpenLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    markAsRead();
  };

  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg ${config.bgClass}`}>
      <span className={`${config.textClass} flex-1 overflow-hidden text-ellipsis whitespace-nowrap`}>
        {email.emailResult}
      </span>
      <div className="flex items-center gap-1">
        {config.hasLinkButton && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={email.emailResult}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenLink}
            >
              <ExternalLink />
            </a>
          </Button>
        )}
        <CopyButton
          text={email.emailResult}
          isCopied={isCopied}
          onCopy={handleCopy}
        />
      </div>
    </div>
  );
}
