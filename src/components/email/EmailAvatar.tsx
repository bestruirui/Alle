"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { MouseEvent } from "react";

interface EmailAvatarProps {
  logo?: string | null;
  name: string;
  isSelected: boolean;
  onClick: (event: MouseEvent) => void;
}

export function EmailAvatar({ logo, name, isSelected, onClick }: EmailAvatarProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.12, rotate: 5 }}
      whileTap={{ scale: 0.92 }}
      className="cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {isSelected ? (
          <motion.div
            key="checkbox"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="w-14 h-14 rounded-xl shadow-[4px_4px_0_var(--memphis-cyan)] border-[3px] border-[var(--memphis-pink)] flex items-center justify-center bg-gradient-to-br from-[var(--memphis-pink)]/20 to-[var(--memphis-purple)]/20"
          >
            <CheckSquare className="h-7 w-7 text-[var(--memphis-pink)]" />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Avatar className="w-14 h-14 shadow-[4px_4px_0_var(--memphis-yellow)] border-[3px] border-border rounded-xl">
              {logo && <AvatarImage src={logo} alt={name} />}
              <AvatarFallback className="bg-gradient-to-br from-[var(--memphis-cyan)]/30 to-[var(--memphis-purple)]/25 text-[var(--memphis-purple)] font-black text-xl rounded-xl">
                {name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
