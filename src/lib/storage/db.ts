import Dexie, { Table } from 'dexie';
import type { Email } from '@/types';

export interface LocalEmail extends Email {
  lastSyncedAt?: number;
  isDirty?: boolean;
}

export class EmailDatabase extends Dexie {
  emails!: Table<LocalEmail, number>;

  constructor() {
    super('EmailDatabase');
    this.version(1).stores({
      emails: 'id, messageId, sentAt, receivedAt, lastSyncedAt, isDirty',
    });
  }
}

export const db = new EmailDatabase();

export const emailStorage = {
  async getAll(): Promise<LocalEmail[]> {
    return await db.emails.orderBy('sentAt').reverse().toArray();
  },

  async getById(id: number): Promise<LocalEmail | undefined> {
    return await db.emails.get(id);
  },

  async bulkPut(emails: Email[]): Promise<void> {
    const now = Date.now();
    const localEmails = emails.map(email => ({
      ...email,
      lastSyncedAt: now,
      isDirty: false,
    }));
    await db.emails.bulkPut(localEmails);
  },

  async delete(ids: number[]): Promise<void> {
    await db.emails.bulkDelete(ids);
  },

  async clear(): Promise<void> {
    await db.emails.clear();
  },

  async getLastSyncTime(): Promise<number> {
    const emails = await db.emails.orderBy('lastSyncedAt').reverse().limit(1).toArray();
    return emails[0]?.lastSyncedAt || 0;
  },

  async count(): Promise<number> {
    return await db.emails.count();
  },
};
