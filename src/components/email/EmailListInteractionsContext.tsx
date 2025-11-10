"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MouseEvent } from "react";
import type { Email } from "@/types";

export interface EmailListInteractionsContextValue {
  copiedId: string | null;
  onCopy: (id: string) => void;
  onEmailClick: (email: Email) => void;
  onEmailDelete?: (emailId: number) => void | Promise<unknown>;
  onAvatarToggle: (email: Email, event: MouseEvent) => void;
}

const EmailListInteractionsContext = createContext<EmailListInteractionsContextValue | null>(null);

interface EmailListInteractionsProviderProps {
  value: EmailListInteractionsContextValue;
  children: ReactNode;
}

export function EmailListInteractionsProvider({ value, children }: EmailListInteractionsProviderProps) {
  return <EmailListInteractionsContext.Provider value={value}>{children}</EmailListInteractionsContext.Provider>;
}

export function useEmailListInteractions() {
  const context = useContext(EmailListInteractionsContext);

  if (!context) {
    throw new Error("useEmailListInteractions must be used within EmailListInteractionsProvider");
  }

  return context;
}
