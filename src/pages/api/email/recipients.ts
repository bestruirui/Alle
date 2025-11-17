import withAuth from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';

import { success, failure } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

async function recipientsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return failure(res, 'Method not allowed', 405);
  }

  try {
    const recipients = await emailDB.getAllRecipients();
    return success<string[]>(res, recipients);
  } catch (e) {
    console.error('Failed to fetch recipients:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(recipientsHandler);