"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface EmailAvatarProps {
  name: string;
  fromAddress?: string | null;
}

function getDomainFromEmail(email: string | null | undefined): string | null {
  if (!email) return null;

  const atIndex = email.indexOf('@');
  if (atIndex === -1) return null;

  const domain = email.substring(atIndex + 1).toLowerCase();
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return domain;
}

export default function EmailAvatar({ name, fromAddress }: EmailAvatarProps) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousTheme = useRef<string | undefined>(undefined);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    async function fetchLogo() {
      const domain = getDomainFromEmail(fromAddress);
      if (domain) {
        try {
          const actualTheme = resolvedTheme || theme;
          const url = `/api/logo/${encodeURIComponent(domain)}${actualTheme ? `?theme=${actualTheme}` : ''}`;
          const response = await apiFetch(url);

          if (response.ok && isMounted) {
            const blob = await response.blob();
            objectUrl = URL.createObjectURL(blob);
            setLogoSrc(objectUrl);
          }
        } catch (error) {
          console.error('Failed to fetch favicon:', error);
        }
      }
    }

    fetchLogo();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fromAddress, theme, resolvedTheme]);

  useEffect(() => {
    const currentTheme = resolvedTheme || theme;
    if (previousTheme.current && previousTheme.current !== currentTheme) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
    previousTheme.current = currentTheme;
  }, [theme, resolvedTheme]);

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isTransitioning ? 0.92 : 1,
        opacity: isTransitioning ? 0.7 : 1,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      <Avatar className="w-12 h-12 shadow-sm">
        <AnimatePresence mode="wait">
          {logoSrc && (
            <motion.div
              key={logoSrc}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <AvatarImage src={logoSrc} alt={name} />
            </motion.div>
          )}
        </AnimatePresence>
        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/3 text-primary font-semibold text-lg">
          {name?.[0] || "?"}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}
