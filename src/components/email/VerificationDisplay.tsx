"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyButton";
import type { Email } from "@/types";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";

export function VerificationDisplay({ email }: { email: Email }) {
  const { copiedId, onCopy } = useEmailListInteractions();
  if (email.verificationType === "link" && email.verificationLink) {
    const copyId = `list-link-${email.id}`;
    const isCopied = copiedId === copyId;

    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20">
        <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
          {email.verificationLink}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl"
            asChild
          >
            <a
              href={email.verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <CopyButton
            text={email.verificationLink}
            isCopied={isCopied}
            onCopy={() => onCopy(copyId)}
          />
        </div>
      </div>
    );
  }

  if (email.verificationType === "code" && email.verificationCode) {
    const copyId = `list-code-${email.id}`;
    const isCopied = copiedId === copyId;

    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
          {email.verificationCode}
        </span>
        <CopyButton
          text={email.verificationCode}
          isCopied={isCopied}
          onCopy={() => onCopy(copyId)}
        />
      </div>
    );
  }

  return null;
}
