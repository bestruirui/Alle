import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, inArray, desc } from 'drizzle-orm';
import { getDb } from './common';

export const email = sqliteTable('email', {
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
  receivedAt: text('received_at').default(sql`CURRENT_TIMESTAMP`),
  verificationType: text('verification_type'),
  verificationCode: text('verification_code'),
  verificationLink: text('verification_link'),
  verificationUsed: integer('verification_used', { mode: 'boolean' }),
  extractResult: text('extract_result'),
});

export type Email = typeof email.$inferSelect;
export type NewEmail = typeof email.$inferInsert;

interface ListParams {
  limit?: number;
  offset?: number;
}

const emailDB = {
  async list(params: ListParams = {}): Promise<Email[]> {
    const db = getDb();
    const { limit = 100, offset = 0 } = params;
    const rows = await db
      .select()
      .from(email)
      .orderBy(desc(email.receivedAt))
      .limit(limit)
      .offset(offset);
    return rows;
  },
  async delete(items: number[] = []): Promise<void> {
    const db = getDb();
    await db.transaction(async (tx) => {
      await tx.delete(email).where(inArray(email.id, items));
    });
  },

  async create(data: NewEmail): Promise<Email> {
    const db = getDb();
    const row = await db.insert(email).values(data).returning().get();
    return row;
  },
};

export default emailDB;
