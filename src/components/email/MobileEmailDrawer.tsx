"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import EmailDetail from "@/components/email/EmailDetail";
import useTranslation from "@/lib/hooks/useTranslation";
import type { Email } from "@/types";

interface MobileEmailDrawerProps {
  open: boolean;
  email: Email | null;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileEmailDrawer({ open, email, onClose, onOpenChange }: MobileEmailDrawerProps) {
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
      <DrawerContent className="max-h-[92vh] md:hidden">
        <DrawerHeader className="hidden">
          <DrawerTitle>{email?.title}</DrawerTitle>
          <DrawerDescription>
            {t("from")} {email?.fromName}
          </DrawerDescription>
        </DrawerHeader>
        <div className="h-[85vh] overflow-hidden">
          <EmailDetail email={email} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
