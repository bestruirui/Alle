"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Settings } from "@/components/Settings";
import { useTranslation } from "@/lib/i18n";

interface MobileSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function MobileSettingsDrawer({ open, onClose, onOpenChange }: MobileSettingsDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] md:hidden">
        <DrawerHeader className="hidden">
          <DrawerTitle>{t("settingsTitle")}</DrawerTitle>
          <DrawerDescription>{t("settingsDesc")}</DrawerDescription>
        </DrawerHeader>
        <div className="h-[85vh] overflow-hidden">
          <Settings onClose={onClose} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
