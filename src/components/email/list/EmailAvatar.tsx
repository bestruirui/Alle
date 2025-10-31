"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { MouseEvent } from "react";

const AVATAR_SIZE = "w-12 h-12";
const ANIMATION_CONFIG = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {isSelected ? (
          <motion.div
            key="checkbox"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={ANIMATION_CONFIG}
            className={`${AVATAR_SIZE} rounded-xl shadow-sm flex items-center justify-center bg-primary/10 border-2 border-primary`}
          >
            <CheckSquare className="h-6 w-6 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={ANIMATION_CONFIG}
          >
            <Avatar className={`${AVATAR_SIZE} shadow-sm`}>
              {logo && <AvatarImage src={logo} alt={name} />}
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-lg">
                {name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
