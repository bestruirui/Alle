import type { MouseEvent } from "react";
import type { Email } from "@/types";

export interface EmailListRenderProps {
  emails: Email[];
  selectedEmailId: number | null;
  selectedEmails: Set<number>;
  formattedTimes: Record<number, string>;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onEmailClick: (email: Email) => void;
  onEmailDelete?: (emailId: number) => void;
  onAvatarToggle: (email: Email, event: MouseEvent) => void;
}
