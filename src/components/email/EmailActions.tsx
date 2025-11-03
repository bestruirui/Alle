"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";

interface EmailActionsProps {
  emailId: number;
  emailName: string;
  isSelectionMode: boolean;
}

export function EmailActions({
  emailId,
  emailName,
  isSelectionMode,
}: EmailActionsProps) {
  const { t } = useTranslation();
  const { onEmailDelete } = useEmailListInteractions();

  if (isSelectionMode || !onEmailDelete) {
    return <div className="w-8 h-8" />;
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <DeleteDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border-[2px] border-transparent hover:border-destructive hover:bg-destructive/10 transition-all duration-300"
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        }
        title={t("deleteConfirm")}
        description={t("deleteDescWithName", { name: emailName })}
        onConfirm={(event) => {
          event?.stopPropagation();
          onEmailDelete(emailId);
        }}
        cancelText={t("cancel")}
        confirmText={t("delete")}
      />
    </div>
  );
}
