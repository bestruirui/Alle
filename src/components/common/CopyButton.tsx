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

export default function CopyButton({ text, isCopied, onCopy, className }: CopyButtonProps) {
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
      className={cn("transition-all duration-200", className)}
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
            <Check className="text-chart-2" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
