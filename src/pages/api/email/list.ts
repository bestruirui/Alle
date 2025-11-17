import withAuth from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';

import { success, failure } from '@/types';

import type { Email } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ListParams } from '@/types';

async function listHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return failure(res, 'Method not allowed', 405);
  }

  const { limit, offset, read_status, email_type, recipient } = req.query;

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return failure(res, 'Limit must be a number between 1 and 100', 400);
    }
  }

  if (offset !== undefined) {
    const offsetNum = Number(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return failure(res, 'Offset must be a non-negative number', 400);
    }
  }

  if (read_status !== undefined) {
    const readStatusNum = Number(read_status);
    if (isNaN(readStatusNum) || ![0, 1].includes(readStatusNum)) {
      return failure(res, 'read_status must be 0 (unread) or 1 (read)', 400);
    }
  }

  if (email_type !== undefined) {
    const validTypes = ['internal_link', 'auth_link', 'auth_code', 'service_link', 'subscription_link', 'other_link', 'none'];
    const types = (email_type as string).split(',').map(t => t.trim());
    for (const t of types) {
      if (!validTypes.includes(t)) {
        return failure(res, 'Invalid email type', 400);
      }
    }
  }

  let recipientValue: string | undefined;
  if (recipient !== undefined) {
    const recipientArray = Array.isArray(recipient) ? recipient : [recipient];
    const normalizedRecipients = recipientArray
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
      .join(',');

    if (!normalizedRecipients) {
      return failure(res, 'recipient must be a non-empty string', 400);
    }

    recipientValue = normalizedRecipients;
  }

  const params: ListParams = {
    limit: limit ? Number(limit) : 100,
    offset: offset ? Number(offset) : 0,
    readStatus: read_status ? Number(read_status) : undefined,
    emailType: email_type as string | undefined,
    recipient: recipientValue,
  };

  try {
    const [data, total] = await Promise.all([
      emailDB.list(params),
      emailDB.count(params),
    ]);
    return success<Email[]>(res, data, 200, { total });
  } catch (e) {
    console.error('Failed to fetch emails:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(listHandler);
