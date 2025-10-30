import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Email } from '@/types';
import { emailStorage } from '@/lib/storage/db';
import { timeFormatterWorkerClient } from '@/lib/services/time-formatter';

const sortEmails = (emails: Email[]) =>
  [...emails].sort((a, b) => {
    const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return dateB - dateA;
  });

interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  selectedEmails: Set<number>;
  formattedTimes: Record<number, string>;
  referenceTime: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  lastSyncTime: number;
  copiedId: string | null;

  setEmails: (emails: Email[]) => void;
  addEmails: (emails: Email[]) => void;
  updateEmail: (id: number, updates: Partial<Email>) => void;
  removeEmails: (ids: number[]) => void;

  setSelectedEmail: (email: Email | null) => void;
  toggleEmailSelection: (id: number) => void;
  selectAllEmails: () => void;
  clearSelection: () => void;

  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: number) => void;
  setCopiedId: (id: string | null) => void;
  setReferenceTime: (time: number) => void;
  setFormattedTime: (id: number, formatted: string) => void;
  requestFormattedTime: (id: number, date: string | null) => Promise<void>;
  clearFormattedTimes: () => void;
  setOffline: (offline: boolean) => void;

  fetchFromLocal: () => Promise<void>;
  syncWithRemote: (authToken: string) => Promise<void>;
  deleteEmails: (authToken: string, ids: number[]) => Promise<void>;
}

export const useEmailStore = create<EmailState>()(
  devtools(
    persist(
      (set, get) => {
        const scheduleFormatting = (emails: Email[]) => {
          if (typeof window === 'undefined' || emails.length === 0) return;
          const referenceTime = Date.now();
          set({ referenceTime });
          timeFormatterWorkerClient.setReferenceTime(referenceTime);
          timeFormatterWorkerClient
            .batchFormat(
              emails.map((email) => ({
                id: email.id,
                date: email.sentAt,
              }))
            )
            .then((mapping) => {
              set((state) => ({
                formattedTimes: { ...state.formattedTimes, ...mapping },
              }));
            })
            .catch((error) => {
              console.error('Failed to format email times:', error);
            });
        };

        const updateSnapshot = (emails: Email[]) => {
          const sorted = sortEmails(emails);
          const emailIds = new Set(sorted.map((email) => email.id));

          set((state) => {
            const selectedEmail =
              state.selectedEmail && emailIds.has(state.selectedEmail.id)
                ? sorted.find((email) => email.id === state.selectedEmail!.id) ?? null
                : null;

            const selectedEmails = new Set(
              Array.from(state.selectedEmails).filter((id) => emailIds.has(id))
            );

            const formattedTimes: Record<number, string> = {};
            for (const id of emailIds) {
              const formatted = state.formattedTimes[id];
              if (formatted !== undefined) {
                formattedTimes[id] = formatted;
              }
            }

            return {
              emails: sorted,
              selectedEmail,
              selectedEmails,
              formattedTimes,
            };
          });

          scheduleFormatting(sorted);
        };

        return {
          emails: [],
          selectedEmail: null,
          selectedEmails: new Set(),
          formattedTimes: {},
          referenceTime: Date.now(),
          isLoading: true,
          isRefreshing: false,
          isSyncing: false,
          isOffline: false,
          lastSyncTime: 0,
          copiedId: null,

          setEmails: updateSnapshot,

          addEmails: (newEmails) => {
            const mergedMap = new Map<number, Email>();
            for (const email of [...newEmails, ...get().emails]) {
              mergedMap.set(email.id, email);
            }
            updateSnapshot(Array.from(mergedMap.values()));
          },

          updateEmail: (id, updates) => {
            const updated = get().emails.map((email) =>
              email.id === id ? { ...email, ...updates } : email
            );
            updateSnapshot(updated);
          },

          removeEmails: (ids) => {
            const remaining = get().emails.filter((email) => !ids.includes(email.id));
            set({ copiedId: null });
            updateSnapshot(remaining);
          },

          setSelectedEmail: (email) => set({ selectedEmail: email }),

          toggleEmailSelection: (id) =>
            set((state) => {
              const selected = new Set(state.selectedEmails);
              if (selected.has(id)) {
                selected.delete(id);
              } else {
                selected.add(id);
              }
              return { selectedEmails: selected };
            }),

          selectAllEmails: () =>
            set((state) => ({
              selectedEmails: new Set(state.emails.map((email) => email.id)),
            })),

          clearSelection: () => set({ selectedEmails: new Set() }),

          setLoading: (loading) => set({ isLoading: loading }),
          setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
          setSyncing: (syncing) => set({ isSyncing: syncing }),
          setLastSyncTime: (time) => set({ lastSyncTime: time }),
          setCopiedId: (id) => set({ copiedId: id }),

          setReferenceTime: (time) => {
            set({ referenceTime: time });
            if (typeof window !== 'undefined') {
              timeFormatterWorkerClient.setReferenceTime(time);
            }
          },

          setFormattedTime: (id, formatted) =>
            set((state) => ({
              formattedTimes: { ...state.formattedTimes, [id]: formatted },
            })),

          requestFormattedTime: async (id, date) => {
            if (typeof window === 'undefined') return;
            try {
              const formatted = await timeFormatterWorkerClient.formatTime(id, date ?? null);
              set((state) => ({
                formattedTimes: { ...state.formattedTimes, [id]: formatted },
              }));
            } catch (error) {
              console.error('Failed to request formatted time:', error);
            }
          },

          clearFormattedTimes: () => set({ formattedTimes: {} }),
          setOffline: (offline) => set({ isOffline: offline }),

          fetchFromLocal: async () => {
            try {
              set({ isLoading: true });
              const localEmails = await emailStorage.getAll();
              const lastSyncTime = await emailStorage.getLastSyncTime();
              updateSnapshot(localEmails);
              set({
                lastSyncTime,
                isLoading: false,
                isOffline: false,
              });
            } catch (error) {
              console.error('Failed to fetch from local:', error);
              set({ isLoading: false });
            }
          },

          syncWithRemote: async (authToken: string) => {
            const state = get();
            if (state.isSyncing) return;

            try {
              set({ isSyncing: true, isRefreshing: true, isOffline: false });

              const response = await fetch('/api/email/list', {
                headers: { Authorization: `Bearer ${authToken}` },
              });

              if (!response.ok) {
                if (response.status === 401) {
                  throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch emails');
              }

              const data = await response.json();

              if (data.success && data.data) {
                const remoteEmails = data.data as Email[];
                await emailStorage.bulkPut(remoteEmails);

                const mergedMap = new Map<number, Email>();
                for (const email of remoteEmails) {
                  mergedMap.set(email.id, email);
                }
                for (const email of state.emails) {
                  if (!mergedMap.has(email.id)) {
                    mergedMap.set(email.id, email);
                  }
                }

                updateSnapshot(Array.from(mergedMap.values()));
                set({
                  lastSyncTime: Date.now(),
                  isSyncing: false,
                  isRefreshing: false,
                  isOffline: false,
                });
              } else {
                set({ isSyncing: false, isRefreshing: false });
              }
            } catch (error) {
              console.error('Failed to sync with remote:', error);
              set({ isSyncing: false, isRefreshing: false, isOffline: true });
              throw error;
            }
          },

          deleteEmails: async (authToken: string, ids: number[]) => {
            if (ids.length === 0) return;

            try {
              const response = await fetch('/api/email/delete', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(ids),
              });

              const data = await response.json();

              if (data.success) {
                await emailStorage.delete(ids);
                get().removeEmails(ids);
              } else {
                throw new Error(data.error || 'Failed to delete emails');
              }
            } catch (error) {
              console.error('Failed to delete emails:', error);
              throw error;
            }
          },
        };
      },
      {
        name: 'email-storage',
        partialize: (state) => ({
          lastSyncTime: state.lastSyncTime,
        }),
      }
    )
  )
);
