"use client";

import { motion } from "framer-motion";
import { RefreshCw, Settings as SettingsIcon, CheckSquare, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useTranslation } from "@/lib/i18n";
interface EmailListHeaderProps {
  hasSelection: boolean;
  selectionCount: number;
  totalCount: number;
  isAllSelected: boolean;
  loading: boolean;
  onRefresh: () => void;
  onToggleSelectAll: () => void;
  onBatchDelete: () => Promise<void> | void;
  onClearSelection: () => void;
  onOpenSettings: () => void;
}

export function EmailListHeader({
  hasSelection,
  selectionCount,
  totalCount,
  isAllSelected,
  loading,
  onRefresh,
  onToggleSelectAll,
  onBatchDelete,
  onClearSelection,
  onOpenSettings,
}: EmailListHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("inbox")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {hasSelection
            ? t("selectedCount", { count: selectionCount })
            : t("emailsCount", { count: totalCount })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {hasSelection ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSelectAll}
              className="h-10 w-10 rounded-xl"
            >
              {isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </Button>

            <DeleteDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
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

            <Button variant="outline" size="sm" onClick={onClearSelection} className="rounded-xl">
              {t("cancel")}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="h-10 w-10 rounded-xl"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={onRefresh}
              disabled={loading}
              className="h-10 w-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
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
    </header>
  );
}
