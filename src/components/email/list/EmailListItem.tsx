"use client";

import { getProviderLogo } from "@/lib/utils/logo";
import type { Email } from "@/types";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { useDevice } from "@/provider/Device";
import { EmailItemAvatar } from "@/components/email/item/EmailItemAvatar";
import { EmailItemHeader } from "@/components/email/item/EmailItemHeader";
import { EmailItemVerification } from "@/components/email/item/EmailItemVerification";

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  onClick: (email: Email) => void;
  onDelete?: (emailId: number) => void;
  onAvatarClick?: (email: Email, event: MouseEvent) => void;
  isEmailSelected?: boolean;
  formattedTime?: string;
}

export function EmailListItem({
  email,
  index,
  isSelected,
  copiedId,
  setCopiedId,
  onClick,
  onDelete,
  onAvatarClick,
  isEmailSelected = false,
  formattedTime = '',
}: EmailListItemProps) {
  const logo = getProviderLogo(email.fromAddress);
  const { isMobile } = useDevice();

  const handleDelete = () => {
    onDelete?.(email.id);
  };

  const handleAvatarClick = (event: MouseEvent) => {
    onAvatarClick?.(email, event);
  };

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={`px-4 py-3 cursor-pointer transition-all duration-200 group ${isSelected && !isMobile
        ? "bg-primary/10 border-l-4 border-l-primary"
        : "hover:bg-accent border-l-4 border-l-transparent"
        }`}
      onClick={() => onClick(email)}
    >
      <div className="flex items-start gap-3">
        <EmailItemAvatar
          logo={logo}
          fromName={email.fromName || ""}
          isSelected={isEmailSelected}
          onClick={handleAvatarClick}
        />

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <EmailItemHeader
            fromName={email.fromName || ""}
            subject={email.subject || ""}
            formattedTime={formattedTime}
            showDelete={!isEmailSelected && !!onDelete}
            onDelete={handleDelete}
          />

          <EmailItemVerification
            verificationType={email.verificationType}
            verificationLink={email.verificationLink}
            verificationCode={email.verificationCode}
            copiedId={copiedId}
            setCopiedId={setCopiedId}
            emailId={email.id}
          />
        </div>
      </div>
    </motion.div>
  );
}
