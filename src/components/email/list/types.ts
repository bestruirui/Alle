import type { MouseEvent } from "react";
import type { Email } from "@/types";

export interface EmailListInteractionsContextValue {
  copiedId: string | null;
  onCopy: (id: string) => void;
  onEmailClick: (email: Email) => void;
  onEmailDelete?: (emailId: number) => void | Promise<unknown>;
  onAvatarToggle: (email: Email, event: MouseEvent) => void;
}
