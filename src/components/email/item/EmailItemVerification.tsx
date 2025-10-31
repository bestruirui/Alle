"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyButton";

interface EmailItemVerificationProps {
  verificationType: "link" | "code" | null;
  verificationLink?: string | null;
  verificationCode?: string | null;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  emailId: number;
}

export function EmailItemVerification({
  verificationType,
  verificationLink,
  verificationCode,
  copiedId,
  setCopiedId,
  emailId,
}: EmailItemVerificationProps) {
  if (verificationType === "link" && verificationLink) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20">
        <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
          {verificationLink}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl transition-all duration-200"
            asChild
          >
            <a
              href={verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <CopyButton
            text={verificationLink}
            copiedId={copiedId}
            setCopiedId={setCopiedId}
            id={`list-link-${emailId}`}
          />
        </div>
      </div>
    );
  }

  if (verificationType === "code" && verificationCode) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
          {verificationCode}
        </span>
        <CopyButton
          text={verificationCode}
          copiedId={copiedId}
          setCopiedId={setCopiedId}
          id={`list-code-${emailId}`}
        />
      </div>
    );
  }

  return null;
}
