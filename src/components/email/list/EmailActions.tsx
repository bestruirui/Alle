"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useTranslation } from "@/lib/i18n";

interface EmailActionsProps {
  emailId: number;
  emailName: string;
  isSelectionMode: boolean;
  onDelete?: (emailId: number) => void;
}

export function EmailActions({
  emailId,
  emailName,
  isSelectionMode,
  onDelete,
}: EmailActionsProps) {
  const { t } = useTranslation();

  if (isSelectionMode || !onDelete) {
    return <div className="w-8 h-8" />;
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <DeleteDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        }
        title={t("deleteConfirm")}
        description={t("deleteDescWithName", { name: emailName })}
        onConfirm={(event) => {
          event?.stopPropagation();
          onDelete(emailId);
        }}
        cancelText={t("cancel")}
        confirmText={t("delete")}
      />
    </div>
  );
}
