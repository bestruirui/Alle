"use client";

import { motion } from "framer-motion";
import { RefreshCw, Settings as SettingsIcon, CheckSquare, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useEmailStore } from "@/lib/store/email";

interface EmailListHeaderProps {
  selectedEmails: Set<number>;
  loading: boolean;
  onRefresh: () => void;
  onToggleSelectAll: () => void;
  onBatchDelete: () => Promise<void> | void;
  onClearSelection: () => void;
  onOpenSettings: () => void;
}

export function EmailListHeader({
  selectedEmails,
  loading,
  onRefresh,
  onToggleSelectAll,
  onBatchDelete,
  onClearSelection,
  onOpenSettings,
}: EmailListHeaderProps) {
  const { t } = useTranslation();
  const totalCount = useEmailStore((state) => state.total);
  const emailCount = useEmailStore((state) => state.emails.length);

  const selectionCount = selectedEmails.size;
  const hasSelection = selectionCount > 0;
  const isAllSelected = hasSelection && selectionCount === emailCount;

  return (
    <header className="relative flex flex-col gap-5 border-b-2 border-border px-8 py-6">
      <span className="memphis-chip shadow-[0_6px_0_rgba(36,17,61,0.12)]">Memphis Inbox</span>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-foreground">{t("inbox")}</h1>
          <div className="h-1 w-14 rounded-full bg-primary" />
          <p className="text-sm text-muted-foreground opacity-80">
            {hasSelection ? (
              <span className="font-semibold text-primary">
                {t("selectedCount", { count: selectionCount })}
              </span>
            ) : (
              t("emailsCount", { count: totalCount })
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasSelection ? (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={onToggleSelectAll}
                className="shadow-[0_10px_0_rgba(49,211,198,0.2)]"
              >
                {isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </Button>

              <DeleteDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="icon"
                    className="shadow-[0_10px_0_rgba(255,140,66,0.24)]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                title={t("batchDeleteConfirm")}
                description={t("batchDeleteDesc", { count: selectionCount })}
                onConfirm={(event) => {
                  event?.stopPropagation();
                  onBatchDelete();
                }}
                cancelText={t("cancel")}
                confirmText={t("delete")}
                allowUnsafeHtml
              />

              <Button variant="outline" size="sm" onClick={onClearSelection}>
                {t("cancel")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                className="shadow-[0_10px_0_rgba(36,17,61,0.12)]"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={onRefresh}
                disabled={loading}
                className="shadow-[0_10px_0_rgba(255,92,141,0.2)]"
              >
                <motion.div
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
