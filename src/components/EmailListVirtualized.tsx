"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Mail, Trash2, CheckSquare, Square, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDevice } from "@/provider/Device";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';
import type { ListRowRenderer } from 'react-virtualized';
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmailDetail } from "@/components/email/EmailDetail";
import { EmailListItem } from "@/components/email/EmailListItem";
import { Settings } from "@/components/Settings";
import type { Email } from "@/types";
import { useEmailStore } from "@/lib/store/email";
import { useTranslation } from "@/lib/i18n";
import { useTimeWorker } from "@/lib/hooks/useTimeWorker";
import { useDeleteEmail, useBatchDeleteEmails } from "@/lib/hooks/useEmailApi";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  onRefresh: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  token: string | null;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 120,
});

export default function EmailListVirtualized({
  emails,
  loading,
  onRefresh,
  onLoadMore,
  hasMore = false,
  token,
}: EmailListProps) {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const { isMobile } = useDevice();
  const selectedEmailId = useEmailStore((state) => state.selectedEmailId);
  const selectEmail = useEmailStore((state) => state.selectEmail);
  const settingsOpen = useEmailStore((state) => state.settingsOpen);
  const setSettingsOpen = useEmailStore((state) => state.setSettingsOpen);
  const formattedTimes = useEmailStore((state) => state.formattedTimes);
  const setVisibleEmailId = useEmailStore((state) => state.setVisibleEmailId);
  const total = useEmailStore((state) => state.total);
  const isOfflineStore = useEmailStore((state) => state.isOffline);
  const listRef = useRef<List | null>(null);
  const [, startTransition] = useTransition();

  const deleteEmailMutation = useDeleteEmail(token);
  const batchDeleteMutation = useBatchDeleteEmails(token);

  useTimeWorker(emails);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;

  const handleEmailClick = useCallback(
    (email: Email) => {
      startTransition(() => {
        selectEmail(email.id);
      });
      if (isMobile) {
        setIsMobileDrawerOpen(true);
      }
    },
    [isMobile, selectEmail, startTransition]
  );

  const handleAvatarClick = useCallback(
    (email: Email, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        if (next.has(email.id)) {
          next.delete(email.id);
        } else {
          next.add(email.id);
        }
        return next;
      });
    },
    []
  );

  const handleDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  const handleDeleteEmail = useCallback(
    async (emailId: number) => {
      await deleteEmailMutation.mutateAsync(emailId);
    },
    [deleteEmailMutation]
  );

  const handleSelectAll = () => {
    if (selectedEmails.size === emails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map((email) => email.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedEmails.size > 0) {
      await batchDeleteMutation.mutateAsync(Array.from(selectedEmails));
      setSelectedEmails(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedEmails(new Set());
  };

  const handleSettingsClick = () => {
    if (isMobile) {
      setMobileSettingsOpen(true);
    } else {
      startTransition(() => {
        setSettingsOpen(!settingsOpen);
        selectEmail(null);
      });
    }
  };

  const handleSettingsClose = () => {
    if (isMobile) {
      setMobileSettingsOpen(false);
    } else {
      startTransition(() => {
        setSettingsOpen(false);
      });
    }
  };

  const isAllSelected = selectedEmails.size === emails.length && emails.length > 0;
  const hasSelection = selectedEmails.size > 0;

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!emails[index];
  };

  const loadMoreRows = async () => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const email = emails[index];
      if (!email) {
        return (
          <div key={key} style={style}>
            <div className="px-4 py-3 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild }: { registerChild: (element: Element | null) => void }) => (
            <div
              ref={(node) => {
                registerChild(node);
              }}
              style={style}
            >
              <EmailListItem
                email={email}
                index={index}
                isSelected={selectedEmailId === email.id}
                copiedId={copiedId}
                setCopiedId={setCopiedId}
                onClick={handleEmailClick}
                onDelete={handleDeleteEmail}
                onAvatarClick={handleAvatarClick}
                isEmailSelected={selectedEmails.has(email.id)}
                formattedTime={formattedTimes[email.id]}
              />
            </div>
          )}
        </CellMeasurer>
      );
    },
    [emails, selectedEmailId, copiedId, selectedEmails, formattedTimes]
  );

  useEffect(() => {
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [emails]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Left sidebar - Email list */}
        <div className="w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border flex flex-col bg-card overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('inbox')}</h1>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>
                    {hasSelection
                      ? t('selectedCount', { count: selectedEmails.size })
                      : t('emailsCount', { count: total })}
                  </span>
                  {isOfflineStore && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs dark:bg-amber-500/20 dark:text-amber-100">
                      {t('offlineMode')}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hasSelection ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSelectAll}
                      className="h-10 w-10 rounded-xl"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
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
                              __html: t('batchDeleteDesc', { count: selectedEmails.size }),
                            }}
                          />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleBatchDelete}
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
                      onClick={handleClearSelection}
                      className="rounded-xl"
                    >
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSettingsClick}
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
                        transition={{
                          repeat: loading ? Infinity : 0,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-hidden">
            {loading && emails.length === 0 ? (
              <div className="divide-y divide-border">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-5 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 flex-shrink-0">
                  <Mail className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('noEmails')}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">{t('noEmailsDesc')}</p>
                <Button onClick={onRefresh} className="rounded-xl flex-shrink-0">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('refreshEmails')}
                </Button>
              </div>
            ) : (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={hasMore ? emails.length + 10 : emails.length}
              >
                {({ onRowsRendered, registerChild }) => (
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        ref={(ref) => {
                          listRef.current = ref;
                          registerChild(ref);
                        }}
                        height={height}
                        width={width}
                        rowCount={emails.length}
                        rowHeight={cache.rowHeight}
                        rowRenderer={rowRenderer}
                        onRowsRendered={onRowsRendered}
                        deferredMeasurementCache={cache}
                        overscanRowCount={5}
                        className="divide-y divide-border"
                      />
                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>
            )}
          </div>
        </div>

        {/* Right panel - Desktop */}
        <div className="hidden md:flex flex-1 bg-background overflow-hidden">
          <div className="w-full max-w-5xl h-full mx-auto">
            {settingsOpen ? (
              <Settings onClose={handleSettingsClose} />
            ) : (
              <EmailDetail email={selectedEmail} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Email detail */}
      <Drawer
        open={isMobileDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose();
          }
        }}
      >
        <DrawerContent className="max-h-[92vh] md:hidden">
          <DrawerHeader className="hidden">
            <DrawerTitle>{selectedEmail?.subject}</DrawerTitle>
            <DrawerDescription>
              {t('from')} {selectedEmail?.fromName}
            </DrawerDescription>
          </DrawerHeader>
          <div className="h-[85vh] overflow-hidden">
            <EmailDetail email={selectedEmail} onClose={handleDrawerClose} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Drawer - Settings */}
      <Drawer open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen}>
        <DrawerContent className="max-h-[92vh] md:hidden">
          <DrawerHeader className="hidden">
            <DrawerTitle>{t('settingsTitle')}</DrawerTitle>
            <DrawerDescription>{t('settingsDesc')}</DrawerDescription>
          </DrawerHeader>
          <div className="h-[85vh] overflow-hidden">
            <Settings onClose={handleSettingsClose} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
