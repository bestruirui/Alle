"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Settings } from "@/components/Settings";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface MobileSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function MobileSettingsDrawer({ open, onClose, onOpenChange }: MobileSettingsDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] md:hidden bg-transparent">
        <DrawerHeader className="hidden">
          <DrawerTitle>{t("settingsTitle")}</DrawerTitle>
          <DrawerDescription>{t("settingsDesc")}</DrawerDescription>
        </DrawerHeader>
        <div className="h-[85vh] overflow-hidden p-4">
          <div className="memphis-panel h-full overflow-hidden border-2 border-border shadow-[0_20px_0_rgba(36,17,61,0.16)]">
            <Settings onClose={onClose} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
