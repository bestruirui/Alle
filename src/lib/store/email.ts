import { create } from 'zustand';

import type { Email, ExtractResultType } from '@/types';

export type ReadStatusFilter = 'all' | 'read' | 'unread';

export interface EmailFilters {
  readStatus: ReadStatusFilter;
  emailTypes: ExtractResultType[];
  recipients: string[];
}

const createDefaultFilters = (): EmailFilters => ({
  readStatus: 'all',
  emailTypes: [],
  recipients: [],
});

const dedupeEmails = (emails: Email[]): Email[] => {
  const map = new Map<number, Email>();
  for (const email of emails) {
    map.set(email.id, email);
  }
  return Array.from(map.values()).sort((a, b) => {
    const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return dateB - dateA;
  });
};

interface EmailStoreState {
  emails: Email[];
  total: number;
  hasMore: boolean;
  selectedEmailId: number | null;
  settingsOpen: boolean;
  lastSyncedAt: string | null;
  visibleEmailId: number | null;
  filters: EmailFilters;
  setEmails: (emails: Email[], total: number, hasMore: boolean) => void;
  appendEmails: (emails: Email[], total: number, hasMore: boolean) => void;
  selectEmail: (emailId: number | null) => void;
  setSettingsOpen: (open: boolean) => void;
  setLastSyncedAt: (sentAt: string | null) => void;
  setVisibleEmailId: (emailId: number | null) => void;
  removeEmail: (emailId: number) => void;
  removeEmails: (emailIds: number[]) => void;
  markEmail: (emailId: number, isRead: boolean) => void;
  updateFilters: (partial: Partial<EmailFilters>) => void;
  resetFilters: () => void;
}

const useEmailStore = create<EmailStoreState>((set, get) => ({
  emails: [],
  total: 0,
  hasMore: false,
  selectedEmailId: null,
  settingsOpen: false,
  lastSyncedAt: null,
  visibleEmailId: null,
  filters: createDefaultFilters(),
  setEmails: (emails, total, hasMore) => {
    set({
      emails: dedupeEmails(emails),
      total,
      hasMore,
      lastSyncedAt: emails.length ? emails[0].sentAt ?? null : get().lastSyncedAt,
    });
  },
  appendEmails: (emails, total, hasMore) => {
    const nextEmails = dedupeEmails([...get().emails, ...emails]);
    set({
      emails: nextEmails,
      total,
      hasMore,
      lastSyncedAt: nextEmails.length ? nextEmails[0].sentAt ?? null : get().lastSyncedAt,
    });
  },
  selectEmail: (emailId) => set({ selectedEmailId: emailId }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setLastSyncedAt: (sentAt) => set({ lastSyncedAt: sentAt }),
  setVisibleEmailId: (emailId) => set({ visibleEmailId: emailId }),
  removeEmail: (emailId) => {
    const nextEmails = get().emails.filter((email) => email.id !== emailId);
    set({
      emails: nextEmails,
      total: Math.max(0, get().total - 1),
      selectedEmailId: get().selectedEmailId === emailId ? null : get().selectedEmailId,
    });
  },
  removeEmails: (emailIds) => {
    const idSet = new Set(emailIds);
    const nextEmails = get().emails.filter((email) => !idSet.has(email.id));
    const selectedId = get().selectedEmailId;
    set({
      emails: nextEmails,
      total: Math.max(0, get().total - emailIds.length),
      selectedEmailId: selectedId && idSet.has(selectedId) ? null : selectedId,
    });
  },
  markEmail: (emailId, isRead) => {
    const readStatusValue = isRead ? 1 : 0;
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, readStatus: readStatusValue } : email,
      ),
    }));
  },
  updateFilters: (partial) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...partial,
      },
    }));
  },
  resetFilters: () => {
    set({ filters: createDefaultFilters() });
  },
}));

export default useEmailStore;
