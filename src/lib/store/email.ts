import { create } from 'zustand';
import type { Email } from '@/types';

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

interface FormattedTimeState {
  id: number;
  formattedTime: string;
}

interface EmailStoreState {
  emails: Email[];
  total: number;
  hasMore: boolean;
  formattedTimes: Record<number, string>;
  selectedEmailId: number | null;
  settingsOpen: boolean;
  isOffline: boolean;
  lastSyncedAt: string | null;
  visibleEmailId: number | null;
  setEmails: (emails: Email[], total: number, hasMore: boolean) => void;
  appendEmails: (emails: Email[], total: number, hasMore: boolean) => void;
  updateFormattedTimes: (formatted: FormattedTimeState[]) => void;
  selectEmail: (emailId: number | null) => void;
  setSettingsOpen: (open: boolean) => void;
  setOffline: (offline: boolean) => void;
  setLastSyncedAt: (sentAt: string | null) => void;
  setVisibleEmailId: (emailId: number | null) => void;
  removeEmail: (emailId: number) => void;
  removeEmails: (emailIds: number[]) => void;
}

export const useEmailStore = create<EmailStoreState>((set, get) => ({
  emails: [],
  total: 0,
  hasMore: false,
  formattedTimes: {},
  selectedEmailId: null,
  settingsOpen: false,
  isOffline: false,
  lastSyncedAt: null,
  visibleEmailId: null,
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
  updateFormattedTimes: (formatted) => {
    const next = { ...get().formattedTimes };
    for (const item of formatted) {
      next[item.id] = item.formattedTime;
    }
    set({ formattedTimes: next });
  },
  selectEmail: (emailId) => set({ selectedEmailId: emailId }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setOffline: (offline) => set({ isOffline: offline }),
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
}));
