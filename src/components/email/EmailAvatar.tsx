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
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.94 }}
      className="cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {isSelected ? (
          <motion.div
            key="checkbox"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-[1.6rem] border-2 border-primary bg-primary/15 text-primary shadow-[0_8px_0_rgba(255,92,141,0.22)]"
          >
            <CheckSquare className="h-6 w-6 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Avatar className="h-12 w-12 shadow-[0_8px_0_rgba(36,17,61,0.14)]">
              {logo && <AvatarImage src={logo} alt={name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
