import { getDb, getDbFromEnv } from './common';
import { sql, inArray, desc } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import type { Email, NewEmail, ListParams, ExtractResultType } from '@/types';

const email = sqliteTable('email', {
  id: integer('id').primaryKey(),
  messageId: text('message_id').unique(),
  fromAddress: text('from_address'),
  fromName: text('from_name'),
  toAddress: text('to_address'),
  recipient: text('recipient'),
  title: text('title'),
  bodyText: text('body_text'),
  bodyHtml: text('body_html'),
  sentAt: text('sent_at'),
  receivedAt: text('received_at'),
  emailType: text('email_type'),
  emailResult: text('email_result'),
  emailResultText: text('email_result_text'),
  emailError: text('email_error'),
});

const emailDB = {
  async list(params: ListParams = {}): Promise<Email[]> {
    const db = getDb();
    const { limit = 100, offset = 0 } = params;
    const rows = await db
      .select()
      .from(email)
      .orderBy(desc(email.sentAt))
      .limit(limit)
      .offset(offset);
    return rows as Email[];
  },

  async count(): Promise<number> {
    const db = getDb();
    const result = await db.select({ count: sql<number>`count(*)` }).from(email);
    return result[0]?.count || 0;
  },
  async delete(items: number[] = []): Promise<void> {
    const db = getDb();
    await db.delete(email).where(inArray(email.id, items));
  },

  async update(params: {
    id: number;
    emailResult: string | null;
    emailType: ExtractResultType;
  }): Promise<void> {
    const db = getDb();
    const { id, emailType, emailResult } = params;

    await db.update(email)
      .set({ emailType, emailResult })
      .where(sql`${email.id} = ${id}`);
  },


  async create(env: CloudflareEnv, data: NewEmail): Promise<Email> {
    const db = getDbFromEnv(env);

    // 确保 emailType 不为 null
    if (!data.emailType) {
      throw new Error('emailType is required and cannot be null');
    }

    const row = await db.insert(email).values(data).returning().get();
    return row as Email;
  },
};

export default emailDB;
