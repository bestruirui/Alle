"use client";

import { useCallback, useState, useTransition, useEffect, type MouseEvent } from "react";
import { useDevice } from "@/provider/Device";
import useEmailStore from "@/lib/store/email";
import { useDeleteEmail, useBatchDeleteEmails, useEmailListInfinite } from "@/lib/hooks/useEmailApi";
import type { Email } from "@/types";
import EmailListHeader from "@/components/email/EmailListHeader";
import EmailListContent from "@/components/email/EmailListContent";
import { EmailListInteractionsProvider } from "@/components/email/EmailListInteractionsContext";
import MobileEmailDrawer from "@/components/email/MobileEmailDrawer";
import MobileSettingsDrawer from "@/components/email/MobileSettingsDrawer";
import EmailDetail from "@/components/email/EmailDetail";
import Settings from "@/components/Settings";

export default function EmailList() {
  const { isMobile } = useDevice();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [, startTransition] = useTransition();

  // 数据获取逻辑
  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } = useEmailListInfinite();
  const emails = useEmailStore((state) => state.emails);
  const selectedEmailId = useEmailStore((state) => state.selectedEmailId);
  const selectEmail = useEmailStore((state) => state.selectEmail);
  const settingsOpen = useEmailStore((state) => state.settingsOpen);
  const setSettingsOpen = useEmailStore((state) => state.setSettingsOpen);

  const deleteEmailMutation = useDeleteEmail();
  const batchDeleteMutation = useBatchDeleteEmails();

  useEffect(() => {
    if (data) {
      const allEmails = data.pages.flatMap((page) => page.emails);
      const total = data.pages[data.pages.length - 1]?.total || 0;
      const loadedCount = allEmails.length;
      const hasMore = loadedCount < total;
      useEmailStore.getState().setEmails(allEmails, total, hasMore);
    }
  }, [data]);

  const loading = isLoading || isFetching;
  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;

  const handleEmailClick = useCallback(
    (email: Email) => {
      startTransition(() => {
        selectEmail(email.id);
        setSettingsOpen(false);
      });
      if (isMobile) {
        setIsMobileDrawerOpen(true);
      }
    },
    [isMobile, selectEmail, setSettingsOpen],
  );

  const handleAvatarToggle = useCallback((email: Email, event: MouseEvent) => {
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
  }, []);

  const handleEmailDelete = useCallback(
    (emailId: number) => deleteEmailMutation.mutateAsync(emailId),
    [deleteEmailMutation],
  );

  const handleCopy = useCallback((id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedEmails((prev) => {
      if (prev.size === emails.length && emails.length > 0) {
        return new Set();
      }
      return new Set(emails.map((email) => email.id));
    });
  }, [emails]);

  const handleBatchDelete = useCallback(async () => {
    if (selectedEmails.size > 0) {
      await batchDeleteMutation.mutateAsync(Array.from(selectedEmails));
      setSelectedEmails(new Set());
    }
  }, [batchDeleteMutation, selectedEmails]);

  const handleOpenSettings = useCallback(() => {
    if (isMobile) {
      setMobileSettingsOpen(true);
    } else {
      startTransition(() => {
        setSettingsOpen(true);
        selectEmail(null);
      });
    }
  }, [isMobile, selectEmail, setSettingsOpen]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-border flex flex-col bg-card overflow-hidden">
          <EmailListHeader
            selectedEmails={selectedEmails}
            loading={loading}
            onRefresh={() => {
              void refetch();
            }}
            onToggleSelectAll={handleToggleSelectAll}
            onBatchDelete={handleBatchDelete}
            onClearSelection={() => setSelectedEmails(new Set())}
            onOpenSettings={handleOpenSettings}
          />

          <div className="flex-1 overflow-hidden">
            <EmailListInteractionsProvider
              value={{
                copiedId,
                onCopy: handleCopy,
                onEmailClick: handleEmailClick,
                onEmailDelete: handleEmailDelete,
                onAvatarToggle: handleAvatarToggle,
              }}
            >
              <EmailListContent
                emails={emails}
                loading={loading}
                hasMore={hasNextPage}
                onLoadMore={handleLoadMore}
                onRefresh={() => {
                  void refetch();
                }}
                selectedEmailId={selectedEmailId}
                selectedEmails={selectedEmails}
              />
            </EmailListInteractionsProvider>
          </div>
        </aside>

        <main className="hidden md:flex flex-1 bg-background overflow-hidden">
          <div className="w-full max-w-5xl mx-auto">{settingsOpen ? <Settings /> : <EmailDetail email={selectedEmail} />}</div>
        </main>
      </div>

      <MobileEmailDrawer open={isMobileDrawerOpen} email={selectedEmail} onClose={() => setIsMobileDrawerOpen(false)} />

      <MobileSettingsDrawer open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen} />
    </div>
  );
}
