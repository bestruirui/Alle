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
    <header className="relative flex items-center justify-between px-6 py-5 border-b-[4px] border-border bg-card/98 backdrop-blur-md overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute -top-4 right-[20%] w-12 h-12 rounded-full border-[3px] border-[var(--memphis-cyan)]"
          style={{ animation: "memphisPulse 3s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-2 left-[15%] w-20 h-[2px]"
          style={{
            background: "repeating-linear-gradient(90deg, var(--memphis-yellow) 0, var(--memphis-yellow) 8px, transparent 8px, transparent 16px)",
          }}
        />
      </div>

      <div className="relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-wide text-foreground relative inline-block">
          {t("inbox")}
          <span
            className="absolute -bottom-1 left-0 h-[3px] w-full rounded"
            style={{
              background: "linear-gradient(90deg, var(--memphis-pink), var(--memphis-cyan))",
            }}
          />
        </h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1.5">
          {hasSelection
            ? t("selectedCount", { count: selectionCount })
            : t("emailsCount", { count: totalCount })}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        {hasSelection ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSelectAll}
              className="h-10 w-10 rounded-xl border-[3px] border-border hover:bg-[var(--memphis-yellow)]/20 hover:border-[var(--memphis-yellow)] transition-all"
            >
              {isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </Button>

            <DeleteDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-[3px] border-border hover:bg-destructive/20 hover:border-destructive transition-all"
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

            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="rounded-xl border-[3px] font-bold uppercase tracking-wide hover:shadow-[4px_4px_0_var(--memphis-cyan)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              {t("cancel")}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="h-10 w-10 rounded-xl border-[3px] border-transparent hover:border-[var(--memphis-purple)] hover:bg-[var(--memphis-purple)]/10 transition-all"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={onRefresh}
              disabled={loading}
              className="h-10 w-10 rounded-xl border-[3px] border-foreground bg-gradient-to-br from-[var(--memphis-pink)] to-[var(--memphis-purple)] hover:from-[var(--memphis-cyan)] hover:to-[var(--memphis-yellow)] shadow-[4px_4px_0_var(--memphis-cyan)] hover:shadow-[6px_6px_0_var(--memphis-cyan)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ repeat: loading ? Infinity : 0, duration: 1.2, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4 text-white" />
              </motion.div>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
