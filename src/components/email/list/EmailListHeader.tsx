"use client";

import { motion } from "framer-motion";
import { RefreshCw, Settings as SettingsIcon, CheckSquare, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EmailListHeaderProps {
  total: number;
  selectedCount: number;
  isAllSelected: boolean;
  hasSelection: boolean;
  loading: boolean;
  onRefresh: () => void;
  onToggleSelectAll: () => void;
  onBatchDelete: () => void;
  onClearSelection: () => void;
  onSettingsClick: () => void;
}

export function EmailListHeader({
  total,
  selectedCount,
  isAllSelected,
  hasSelection,
  loading,
  onRefresh,
  onToggleSelectAll,
  onBatchDelete,
  onClearSelection,
  onSettingsClick,
}: EmailListHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex-shrink-0 px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('inbox')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {hasSelection
              ? t('selectedCount', { count: selectedCount })
              : t('emailsCount', { count: total })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasSelection ? (
            <SelectionActions
              isAllSelected={isAllSelected}
              selectedCount={selectedCount}
              onToggleSelectAll={onToggleSelectAll}
              onBatchDelete={onBatchDelete}
              onClearSelection={onClearSelection}
            />
          ) : (
            <DefaultActions
              loading={loading}
              onRefresh={onRefresh}
              onSettingsClick={onSettingsClick}
            />
          )}
        </div>
      </div>
    </header>
  );
}

interface DefaultActionsProps {
  loading: boolean;
  onRefresh: () => void;
  onSettingsClick: () => void;
}

function DefaultActions({ loading, onRefresh, onSettingsClick }: DefaultActionsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSettingsClick}
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
  );
}

interface SelectionActionsProps {
  isAllSelected: boolean;
  selectedCount: number;
  onToggleSelectAll: () => void;
  onBatchDelete: () => void;
  onClearSelection: () => void;
}

function SelectionActions({
  isAllSelected,
  selectedCount,
  onToggleSelectAll,
  onBatchDelete,
  onClearSelection,
}: SelectionActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSelectAll}
        className="h-10 w-10 rounded-xl"
      >
        {isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('batchDeleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription
              dangerouslySetInnerHTML={{
                __html: t('batchDeleteDesc', { count: selectedCount }),
              }}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onBatchDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearSelection}
        className="rounded-xl"
      >
        {t('cancel')}
      </Button>
    </>
  );
}
