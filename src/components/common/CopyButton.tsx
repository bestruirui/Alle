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
      className={cn("h-9 w-9 rounded-2xl border-2 border-border bg-card shadow-[0_6px_0_rgba(36,17,61,0.12)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-ring/40 focus-visible:ring-[3px]", className)}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3.5 w-3.5 text-chart-2" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
