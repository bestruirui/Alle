import type { NextApiRequest, NextApiResponse } from 'next';
import { success, failure } from '@/types';
import { withAuth } from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';
import type { Email } from '@/types';

async function listHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return failure(res, 'Method not allowed', 405);
  }

  const { limit, offset } = req.query;

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

  const params = {
    limit: limit ? Number(limit) : 100,
    offset: offset ? Number(offset) : 0,
  };

  try {
    const [data, total] = await Promise.all([
      emailDB.list(params),
      emailDB.count(),
    ]);
    return success<Email[]>(res, data, 200, { total });
  } catch (e) {
    console.error('Failed to fetch emails:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(listHandler);
