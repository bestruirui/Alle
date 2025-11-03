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
      <div className="flex items-center gap-3 rounded-[1.4rem] border-2 border-chart-3 bg-chart-3/20 px-4 py-3 shadow-[0_8px_0_rgba(124,108,255,0.18)] backdrop-blur-sm">
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {email.verificationLink}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-2xl border-2 border-border bg-card shadow-[0_6px_0_rgba(36,17,61,0.12)]"
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
      <div className="flex items-center gap-3 rounded-[1.4rem] border-2 border-primary bg-primary/12 px-4 py-3 shadow-[0_8px_0_rgba(255,92,141,0.22)] backdrop-blur-sm">
        <span className="flex-1 font-mono text-2xl font-black tracking-[0.4em] text-primary">
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
