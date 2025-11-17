import withAuth from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';

import { success, failure } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

async function markHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return failure(res, 'Method not allowed', 405);
  }

  const { id, is_read } = req.query;

  try {
    if (id === undefined) {
      return failure(res, 'Email ID is required', 400);
    }

    if (is_read === undefined) {
      return failure(res, 'is_read parameter is required', 400);
    }

    const emailId = Number(id);
    if (isNaN(emailId) || !Number.isInteger(emailId) || emailId < 1) {
      return failure(res, 'Invalid email ID', 400);
    }

    const isReadValue = Number(is_read);
    if (isNaN(isReadValue) || ![0, 1].includes(isReadValue)) {
      return failure(res, 'is_read must be 0 (unread) or 1 (read)', 400);
    }

    if (isReadValue === 1) {
      await emailDB.markAsRead(emailId);
    } else {
      await emailDB.markAsUnread(emailId);
    }

    return success(res, null, 200);
  } catch (e) {
    console.error('Failed to mark email:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(markHandler);
