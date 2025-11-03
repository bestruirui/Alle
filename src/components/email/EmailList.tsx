"use client";

import { useCallback, useState, useTransition, useEffect, type MouseEvent } from "react";
import { useDevice } from "@/provider/Device";
import { useEmailStore } from "@/lib/store/email";
import { useDeleteEmail, useBatchDeleteEmails, useEmailListInfinite } from "@/lib/hooks/useEmailApi";
import type { Email } from "@/types";
import { EmailListHeader } from "@/components/email/EmailListHeader";
import { EmailListContent } from "@/components/email/EmailListContent";
import { EmailListInteractionsProvider } from "@/components/email/EmailListInteractionsContext";
import { MobileEmailDrawer } from "@/components/email/MobileEmailDrawer";
import { MobileSettingsDrawer } from "@/components/email/MobileSettingsDrawer";
import { EmailDetail } from "@/components/email/EmailDetail";
import { Settings } from "@/components/Settings";

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

  // 同步 store 与查询数据
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

  const handleCloseSettings = useCallback(() => {
    if (isMobile) {
      setMobileSettingsOpen(false);
    } else {
      startTransition(() => {
        setSettingsOpen(false);
      });
    }
  }, [isMobile, setSettingsOpen]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="min-h-screen memphis-pattern relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="memphis-shape memphis-shape--circle -left-48 -top-32" />
        <div className="memphis-shape memphis-shape--triangle right-[-90px] bottom-24" />
        <div className="memphis-shape memphis-shape--stripe left-1/2 top-1/2 -translate-x-1/2 translate-y-16" />
      </div>

      <div className="relative z-10 flex h-screen flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8">
        <aside className="relative flex h-full w-full flex-col md:w-[420px] lg:w-[480px]">
          <div className="memphis-panel flex h-full flex-col overflow-hidden border-2 border-border shadow-[0_24px_0_rgba(36,17,61,0.18)] backdrop-blur-[14px]">
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
          </div>
        </aside>

        <main className="relative hidden h-full flex-1 md:flex">
          <div className="memphis-panel flex h-full w-full overflow-hidden border-2 border-border shadow-[0_24px_0_rgba(36,17,61,0.18)] backdrop-blur-[14px]">
            <div className="mx-auto flex w-full max-w-5xl flex-1">
              {settingsOpen ? <Settings onClose={handleCloseSettings} /> : <EmailDetail email={selectedEmail} />}
            </div>
          </div>
        </main>
      </div>

      <MobileEmailDrawer open={isMobileDrawerOpen} email={selectedEmail} onClose={() => setIsMobileDrawerOpen(false)} />

      <MobileSettingsDrawer open={mobileSettingsOpen} onClose={handleCloseSettings} onOpenChange={setMobileSettingsOpen} />
    </div>
  );
}
