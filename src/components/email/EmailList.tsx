"use client";

import { useCallback, useState, useTransition, useEffect, type MouseEvent } from "react";
import { motion } from "framer-motion";
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
    <div className="relative min-h-screen px-4 py-6 md:px-10 lg:px-16 xl:px-24">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute top-12 left-[5%] w-36 h-36 rounded-full border-[8px] border-[var(--memphis-yellow)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          style={{ opacity: 0.35 }}
        />
        <motion.div
          className="absolute bottom-20 right-[8%]"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          style={{ opacity: 0.4 }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "60px solid transparent",
              borderRight: "60px solid transparent",
              borderBottom: "100px solid var(--memphis-purple)",
            }}
          />
        </motion.div>
        <motion.div
          className="absolute top-[40%] left-[18%] w-28 h-[3px]"
          style={{
            background: "repeating-linear-gradient(90deg, var(--memphis-cyan) 0, var(--memphis-cyan) 12px, transparent 12px, transparent 24px)",
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative z-10 flex h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-[2rem] border-[4px] border-border bg-card/90 shadow-[12px_12px_0_var(--memphis-pink)] backdrop-blur-xl lg:flex-row lg:h-[calc(100vh-6rem)]">
        <aside className="relative flex w-full flex-shrink-0 flex-col overflow-hidden border-b-[4px] border-border bg-card/90 lg:w-[430px] lg:border-b-0 lg:border-r-[4px]">
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

          <div className="relative flex-1 overflow-hidden">
            <EmailListInteractionsProvider
              value={{
                copiedId,
                onCopy: handleCopy,
                onEmailClick: handleEmailClick,
                onEmailDelete: handleEmailDelete,
                onAvatarToggle: handleAvatarToggle,
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="memphis-pattern-dots absolute inset-0" />
              </div>
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

        <main className="relative hidden flex-1 overflow-hidden bg-background/40 px-6 py-8 lg:flex">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="memphis-pattern-grid absolute inset-0" />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col">
            {settingsOpen ? (
              <div className="memphis-card h-full overflow-hidden rounded-[1.75rem] border-[4px] border-border bg-card/95 p-1">
                <Settings onClose={handleCloseSettings} />
              </div>
            ) : (
              <div className="memphis-card h-full overflow-hidden rounded-[1.75rem] border-[4px] border-border bg-card/95 p-1">
                <EmailDetail email={selectedEmail} />
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileEmailDrawer open={isMobileDrawerOpen} email={selectedEmail} onClose={() => setIsMobileDrawerOpen(false)} />

      <MobileSettingsDrawer open={mobileSettingsOpen} onClose={handleCloseSettings} onOpenChange={setMobileSettingsOpen} />
    </div>
  );
}
