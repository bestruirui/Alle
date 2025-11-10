"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Settings from "@/components/Settings";
import useTranslation from "@/lib/hooks/useTranslation";

interface MobileSettingsDrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileSettingsDrawer({ open, onOpenChange }: MobileSettingsDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] md:hidden">
        <DrawerHeader className="hidden">
          <DrawerTitle>{t("settingsTitle")}</DrawerTitle>
          <DrawerDescription>{t("settingsDesc")}</DrawerDescription>
        </DrawerHeader>
        <div className="h-[85vh] overflow-hidden">
          <Settings />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
