"use client";

import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20"
      >
        <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
          {email.verificationLink}
        </span>
        <div className="flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
          </motion.div>
          <CopyButton
            text={email.verificationLink}
            isCopied={isCopied}
            onCopy={() => onCopy(copyId)}
          />
        </div>
      </motion.div>
    );
  }

  if (email.verificationType === "code" && email.verificationCode) {
    const copyId = `list-code-${email.id}`;
    const isCopied = copiedId === copyId;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.05em" }}
          animate={{ opacity: 1, letterSpacing: "0.1em" }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-lg font-bold font-mono text-primary tracking-wider flex-1"
        >
          {email.verificationCode}
        </motion.span>
        <CopyButton
          text={email.verificationCode}
          isCopied={isCopied}
          onCopy={() => onCopy(copyId)}
        />
      </motion.div>
    );
  }

  return null;
}
