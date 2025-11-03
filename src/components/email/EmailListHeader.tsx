"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm"
    >
      <motion.div layout className="space-y-1">
        <motion.h1 layout className="text-2xl font-bold text-foreground tracking-tight">
          {t("inbox")}
        </motion.h1>
        <motion.p layout className="text-sm text-muted-foreground">
          {hasSelection
            ? t("selectedCount", { count: selectionCount })
            : t("emailsCount", { count: totalCount })}
        </motion.p>
      </motion.div>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {hasSelection ? (
            <motion.div
              key="selection-actions"
              layout
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSelectAll}
                className="h-10 w-10 rounded-xl"
              >
                {isAllSelected ? (
                  <motion.div
                    key="all-selected"
                    layout
                    initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckSquare className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="partial-selected"
                    layout
                    initial={{ rotate: 90, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Square className="h-4 w-4" />
                  </motion.div>
                )}
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
            </motion.div>
          ) : (
            <motion.div
              key="default-actions"
              layout
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                className="h-10 w-10 rounded-xl"
              >
                <motion.div
                  layout
                  whileHover={{ rotate: 20 }}
                  whileTap={{ rotate: -20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <SettingsIcon className="h-4 w-4" />
                </motion.div>
              </Button>
              <Button
                size="icon"
                onClick={onRefresh}
                disabled={loading}
                className="h-10 w-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ repeat: loading ? Infinity : 0, duration: 0.8, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
