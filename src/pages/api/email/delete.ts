import withAuth from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';

import { success, failure } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return failure(res, 'Method not allowed', 405);
  }

  const items = req.body;

  if (!Array.isArray(items)) {
    return failure(res, 'Request body must be an array of email IDs', 400);
  }

  if (items.length === 0) {
    return failure(res, 'At least one email ID is required', 400);
  }

  const invalidIds = items.filter(
    (id) => typeof id !== 'number' || !Number.isInteger(id) || id < 1
  );

  if (invalidIds.length > 0) {
    return failure(res, 'All email IDs must be positive integers', 400);
  }

  try {
    await emailDB.delete(items);
    return success(res, null, 200);
  } catch (e) {
    console.error('Failed to delete emails:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(deleteHandler);
