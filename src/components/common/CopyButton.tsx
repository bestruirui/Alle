"use client";

import { useCallback, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface CopyButtonProps {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
  className?: string;
}

export function CopyButton({ text, isCopied, onCopy, className }: CopyButtonProps) {
  const handleCopy = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      navigator.clipboard.writeText(text);
      onCopy();
    },
    [onCopy, text],
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn(
        "h-8 w-8 rounded-lg border-[2px] border-transparent hover:border-[var(--memphis-purple)] hover:bg-[var(--memphis-purple)]/10 transition-all duration-300 shadow-[2px_2px_0_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            <Check className="h-4 w-4 text-[var(--memphis-cyan)]" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Copy className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
