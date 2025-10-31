"use client";

import { useCallback, useState, useTransition, type MouseEvent } from "react";
import { useDevice } from "@/provider/Device";
import { useEmailStore } from "@/lib/store/email";
import { useTimeWorker } from "@/lib/hooks/useTimeWorker";
import { useDeleteEmail, useBatchDeleteEmails } from "@/lib/hooks/useEmailApi";
import type { Email } from "@/types";
import { EmailListHeader } from "@/components/email/list/EmailListHeader";
import { EmailListContent } from "@/components/email/list/EmailListContent";
import { MobileEmailDrawer } from "@/components/email/list/MobileEmailDrawer";
import { MobileSettingsDrawer } from "@/components/email/list/MobileSettingsDrawer";
import { EmailDetail } from "@/components/email/EmailDetail";
import { Settings } from "@/components/Settings";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  onRefresh: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  token: string | null;
}

export default function EmailList({ emails, loading, onRefresh, onLoadMore, hasMore = false, token }: EmailListProps) {
  const { isMobile } = useDevice();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const selectedEmailId = useEmailStore((state) => state.selectedEmailId);
  const selectEmail = useEmailStore((state) => state.selectEmail);
  const settingsOpen = useEmailStore((state) => state.settingsOpen);
  const setSettingsOpen = useEmailStore((state) => state.setSettingsOpen);
  const formattedTimes = useEmailStore((state) => state.formattedTimes);
  const total = useEmailStore((state) => state.total);

  const deleteEmailMutation = useDeleteEmail(token);
  const batchDeleteMutation = useBatchDeleteEmails(token);

  useTimeWorker(emails);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;
  const hasSelection = selectedEmails.size > 0;
  const isAllSelected = selectedEmails.size === emails.length && emails.length > 0;

  const handleEmailClick = useCallback(
    (email: Email) => {
      startTransition(() => {
        selectEmail(email.id);
      });
      if (isMobile) {
        setIsMobileDrawerOpen(true);
      }
    },
    [isMobile, selectEmail],
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

  const handleCopy = useCallback((id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDeleteEmail = useCallback(
    async (emailId: number) => {
      await deleteEmailMutation.mutateAsync(emailId);
    },
    [deleteEmailMutation],
  );

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map((email) => email.id)));
    }
  }, [emails, isAllSelected]);

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
        setSettingsOpen(!settingsOpen);
        selectEmail(null);
      });
    }
  }, [isMobile, selectEmail, setSettingsOpen, settingsOpen]);

  const handleCloseSettings = useCallback(() => {
    if (isMobile) {
      setMobileSettingsOpen(false);
    } else {
      startTransition(() => {
        setSettingsOpen(false);
      });
    }
  }, [isMobile, setSettingsOpen]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <aside className="w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border flex flex-col bg-card overflow-hidden">
          <EmailListHeader
            hasSelection={hasSelection}
            selectionCount={selectedEmails.size}
            totalCount={total}
            isAllSelected={isAllSelected}
            loading={loading}
            onRefresh={onRefresh}
            onToggleSelectAll={handleToggleSelectAll}
            onBatchDelete={handleBatchDelete}
            onClearSelection={() => setSelectedEmails(new Set())}
            onOpenSettings={handleOpenSettings}
          />

          <div className="flex-1 overflow-hidden">
            <EmailListContent
              emails={emails}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              onRefresh={onRefresh}
              selectedEmailId={selectedEmailId}
              selectedEmails={selectedEmails}
              formattedTimes={formattedTimes}
              copiedId={copiedId}
              onCopy={handleCopy}
              onEmailClick={handleEmailClick}
              onEmailDelete={handleDeleteEmail}
              onAvatarToggle={handleAvatarToggle}
            />
          </div>
        </aside>

        <main className="hidden md:flex flex-1 bg-background overflow-hidden">
          <div className="w-full max-w-5xl mx-auto">{settingsOpen ? <Settings onClose={handleCloseSettings} /> : <EmailDetail email={selectedEmail} />}</div>
        </main>
      </div>

      <MobileEmailDrawer open={isMobileDrawerOpen} email={selectedEmail} onClose={() => setIsMobileDrawerOpen(false)} />

      <MobileSettingsDrawer open={mobileSettingsOpen} onClose={handleCloseSettings} onOpenChange={setMobileSettingsOpen} />
    </div>
  );
}
