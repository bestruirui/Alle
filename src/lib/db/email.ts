import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { inArray, desc } from 'drizzle-orm';
import { getDb, getDbFromEnv } from './common';
import type { Email, NewEmail } from '@/types';

const email = sqliteTable('email', {
  id: integer('id').primaryKey(),
  messageId: text('message_id').unique(),
  fromAddress: text('from_address'),
  fromName: text('from_name'),
  senderAddress: text('sender_address'),
  toAddress: text('to_address'),
  recipient: text('recipient'),
  subject: text('subject'),
  bodyText: text('body_text'),
  bodyHtml: text('body_html'),
  sentAt: text('sent_at'),
  receivedAt: text('received_at'),
  verificationType: text('verification_type'),
  verificationCode: text('verification_code'),
  verificationLink: text('verification_link'),
  verificationUsed: integer('verification_used', { mode: 'boolean' }),
  extractResult: text('extract_result'),
});

const emailDB = {
  async list(limit: number, offset: number): Promise<Email[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(email)
      .orderBy(desc(email.sentAt))
      .limit(limit)
      .offset(offset);
    return rows;
  },
  async delete(items: number[] = []): Promise<void> {
    const db = getDb();
    await db.delete(email).where(inArray(email.id, items));
  },


  async create(env: CloudflareEnv, data: NewEmail): Promise<Email> {
    const db = getDbFromEnv(env);
    const row = await db.insert(email).values(data).returning().get();
    return row;
  },
};

export default emailDB;
