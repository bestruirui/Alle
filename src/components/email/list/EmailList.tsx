"use client";

import { useState, useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import type { MouseEvent } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from "react-virtualized";
import type { ListRowRenderer } from "react-virtualized";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { Email } from "@/types";
import { useDevice } from "@/provider/Device";
import { EmailDetail } from "@/components/email/detail/EmailDetail";
import { Settings } from "@/components/Settings";
import { EmailListItem } from "./EmailListItem";
import { EmailListHeader } from "./EmailListHeader";
import { EmailListSkeleton } from "./EmailListSkeleton";
import { EmailListEmpty } from "./EmailListEmpty";
import { useEmailStore } from "@/lib/store/email";
import { useTimeWorker } from "@/lib/hooks/useTimeWorker";
import { useDeleteEmail, useBatchDeleteEmails } from "@/lib/hooks/useEmailApi";
import { useEmailSelection } from "@/lib/hooks/email/useEmailSelection";

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

export default function EmailList({
  emails,
  loading,
  onRefresh,
  onLoadMore,
  hasMore = false,
  token,
}: EmailListProps) {
  const listRef = useRef<List | null>(null);
  const { isMobile } = useDevice();
  const [, startTransition] = useTransition();
  const deleteEmailMutation = useDeleteEmail(token);
  const batchDeleteMutation = useBatchDeleteEmails(token);

  const selectedEmailId = useEmailStore((state) => state.selectedEmailId);
  const selectEmail = useEmailStore((state) => state.selectEmail);
  const settingsOpen = useEmailStore((state) => state.settingsOpen);
  const setSettingsOpen = useEmailStore((state) => state.setSettingsOpen);
  const formattedTimes = useEmailStore((state) => state.formattedTimes);
  const total = useEmailStore((state) => state.total);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    selectedEmails,
    isAllSelected,
    hasSelection,
    handleSelectAll,
    handleToggleEmail,
    handleClearSelection,
  } = useEmailSelection(emails);

  useTimeWorker(emails);

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedEmailId) || null,
    [emails, selectedEmailId]
  );

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
    (email: Email, event: MouseEvent) => {
      event.stopPropagation();
      handleToggleEmail(email);
    },
    [handleToggleEmail]
  );

  const handleDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const handleDeleteEmail = useCallback(
    async (emailId: number) => {
      await deleteEmailMutation.mutateAsync(emailId);
    },
    [deleteEmailMutation]
  );

  const handleBatchDelete = useCallback(async () => {
    if (selectedEmails.size === 0) return;
    await batchDeleteMutation.mutateAsync(Array.from(selectedEmails));
    handleClearSelection();
  }, [batchDeleteMutation, selectedEmails, handleClearSelection]);

  const handleSettingsClick = useCallback(() => {
    if (isMobile) {
      setMobileSettingsOpen(true);
      return;
    }

    startTransition(() => {
      setSettingsOpen(!settingsOpen);
      selectEmail(null);
    });
  }, [isMobile, settingsOpen, setSettingsOpen, selectEmail, startTransition]);

  const handleSettingsClose = useCallback(() => {
    if (isMobile) {
      setMobileSettingsOpen(false);
      return;
    }

    startTransition(() => {
      setSettingsOpen(false);
    });
  }, [isMobile, setSettingsOpen, startTransition]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => Boolean(emails[index]),
    [emails]
  );

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const email = emails[index];

      if (!email) {
        return (
          <div key={key} style={style} className="px-4 py-3">
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
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
          {({ registerChild }) => (
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
    [emails, selectedEmailId, copiedId, formattedTimes, handleEmailClick, handleDeleteEmail, handleAvatarClick, selectedEmails]
  );

  useEffect(() => {
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [emails]);

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-background">
      <aside className="flex w-full flex-col overflow-hidden border-r border-border bg-card md:w-[420px] lg:w-[480px]">
        <EmailListHeader
          total={total}
          selectedCount={selectedEmails.size}
          isAllSelected={isAllSelected}
          hasSelection={hasSelection}
          loading={loading}
          onRefresh={onRefresh}
          onToggleSelectAll={handleSelectAll}
          onBatchDelete={handleBatchDelete}
          onClearSelection={handleClearSelection}
          onSettingsClick={handleSettingsClick}
        />

        <div className="flex-1 min-h-0">
          {loading && emails.length === 0 ? (
            <EmailListSkeleton />
          ) : emails.length === 0 ? (
            <EmailListEmpty onRefresh={onRefresh} />
          ) : (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={handleLoadMore}
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
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    />
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          )}
        </div>
      </aside>

      <section className="hidden md:flex flex-1 bg-background overflow-hidden">
        <div className="w-full max-w-5xl mx-auto">
          {settingsOpen ? (
            <Settings onClose={handleSettingsClose} />
          ) : (
            <EmailDetail email={selectedEmail} />
          )}
        </div>
      </section>

      <Drawer open={isMobileDrawerOpen} onOpenChange={(open) => !open && handleDrawerClose()}>
        <DrawerContent className="max-h-[92vh] md:hidden">
          <div className="h-[85vh] overflow-hidden">
            <EmailDetail email={selectedEmail} onClose={handleDrawerClose} />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen}>
        <DrawerContent className="max-h-[92vh] md:hidden">
          <div className="h-[85vh] overflow-hidden">
            <Settings onClose={handleSettingsClose} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
