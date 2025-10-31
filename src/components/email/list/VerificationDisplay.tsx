"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyButton";
import type { Email } from "@/types";

interface VerificationDisplayProps {
  email: Email;
  isCopied: (id: string) => boolean;
  onCopy: (id: string) => void;
}

export function VerificationDisplay({ email, isCopied, onCopy }: VerificationDisplayProps) {
  if (email.verificationType === "link" && email.verificationLink) {
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
            isCopied={isCopied(`list-link-${email.id}`)}
            onCopy={() => onCopy(`list-link-${email.id}`)}
          />
        </div>
      </div>
    );
  }

  if (email.verificationType === "code" && email.verificationCode) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
          {email.verificationCode}
        </span>
        <CopyButton
          text={email.verificationCode}
          isCopied={isCopied(`list-code-${email.id}`)}
          onCopy={() => onCopy(`list-code-${email.id}`)}
        />
      </div>
    );
  }

  return null;
}
