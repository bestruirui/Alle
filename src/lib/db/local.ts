import Dexie, { Table } from 'dexie';
import type { Email } from '@/types';

export class LocalEmailDatabase extends Dexie {
  emails!: Table<Email, number>;

  constructor() {
    super('AlleEmailDatabase');
    this.version(1).stores({
      emails: 'id, messageId, sentAt, receivedAt',
    });
  }
}

export const localDB = new LocalEmailDatabase();

export const localEmailDB = {
  async list(limit = 100, offset = 0): Promise<Email[]> {
    return await localDB.emails
      .orderBy('sentAt')
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();
  },

  async count(): Promise<number> {
    return await localDB.emails.count();
  },

  async bulkPut(emails: Email[]): Promise<void> {
    await localDB.emails.bulkPut(emails);
  },

  async deleteMany(ids: number[]): Promise<void> {
    await localDB.emails.bulkDelete(ids);
  },

  async clear(): Promise<void> {
    await localDB.emails.clear();
  },

  async getLatestSentAt(): Promise<string | null> {
    const latest = await localDB.emails.orderBy('sentAt').reverse().first();
    return latest?.sentAt || null;
  },
};
