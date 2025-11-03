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
    <div className="flex h-9 w-9 items-center justify-center">
      <DeleteDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-2xl border-2 border-border bg-card shadow-[0_6px_0_rgba(36,17,61,0.12)]"
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
