"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { EmailDetail } from "@/components/email/EmailDetail";
import type { Email } from "@/types";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface MobileEmailDrawerProps {
  open: boolean;
  email: Email | null;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function MobileEmailDrawer({ open, email, onClose, onOpenChange }: MobileEmailDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
        onOpenChange?.(nextOpen);
      }}
    >
      <DrawerContent className="max-h-[92vh] md:hidden bg-transparent">
        <DrawerHeader className="hidden">
          <DrawerTitle>{email?.subject}</DrawerTitle>
          <DrawerDescription>
            {t("from")} {email?.fromName}
          </DrawerDescription>
        </DrawerHeader>
        <div className="h-[85vh] overflow-hidden p-4">
          <div className="memphis-panel h-full overflow-hidden border-2 border-border shadow-[0_20px_0_rgba(36,17,61,0.16)]">
            <EmailDetail email={email} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
