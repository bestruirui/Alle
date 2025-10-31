import type { NextApiRequest, NextApiResponse } from 'next';
import { success, failure } from '@/types';
import { withAuth } from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';
import type { EmailList } from '@/types';

async function listHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return failure(res, 'Method not allowed', 405);
  }

  const { limit, offset } = req.query;
  let limitNum: number = 100;
  let offsetNum: number = 0;

  if (limit !== undefined) {
    limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return failure(res, 'Limit must be a number between 1 and 100', 400);
    }
  }

  if (offset !== undefined) {
    offsetNum = Number(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return failure(res, 'Offset must be a non-negative number', 400);
    }
  }

  try {
    const data = await emailDB.list(limitNum, offsetNum);
    return success<EmailList>(res, data, 200);
  } catch (e) {
    console.error('Failed to fetch emails:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(listHandler);
