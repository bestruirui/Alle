"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";
import CopyButton from "@/components/common/CopyButton";
import getEmailTypeStyle from "@/lib/constants/emailTypes";
import type { Email } from "@/types";

export default function VerificationDisplay({ email }: { email: Email }) {
  const { copiedId, onCopy } = useEmailListInteractions();

  if (!email.emailResult || email.emailType === "none") {
    return null;
  }

  const config = getEmailTypeStyle(email.emailType);
  const copyId = `list-result-${email.id}`;
  const isCopied = copiedId === copyId;

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
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink />
            </a>
          </Button>
        )}
        <CopyButton
          text={email.emailResult}
          isCopied={isCopied}
          onCopy={() => onCopy(copyId)}
        />
      </div>
    </div>
  );
}
