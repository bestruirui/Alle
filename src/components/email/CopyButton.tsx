"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  id: string | number;
}

export function CopyButton({ text, copiedId, setCopiedId, id }: CopyButtonProps) {
  const copied = copiedId === String(id);
  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-8 w-8 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md border-border`}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(String(id));
        setTimeout(() => setCopiedId(null), 2000);
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Check className={`h-3.5 w-3.5 text-chart-2`} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className={`h-3.5 w-3.5`} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}