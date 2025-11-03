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
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[var(--memphis-cyan)]/15 to-[var(--memphis-purple)]/10 border-[3px] border-[var(--memphis-cyan)]/30 shadow-[3px_3px_0_var(--memphis-yellow)]/20">
        <span className="text-xs font-semibold text-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
          {email.verificationLink}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border-[2px] border-transparent hover:border-[var(--memphis-cyan)] hover:bg-[var(--memphis-cyan)]/10 transition-all"
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
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[var(--memphis-pink)]/15 to-[var(--memphis-yellow)]/15 border-[3px] border-[var(--memphis-pink)]/40 shadow-[4px_4px_0_var(--memphis-cyan)]/25 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, var(--memphis-purple) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
        </div>
        <span className="relative z-10 text-xl font-black font-mono text-[var(--memphis-pink)] tracking-[0.3em] flex-1 uppercase">
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
