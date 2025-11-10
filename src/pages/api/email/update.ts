import withAuth from '@/lib/auth/auth';
import emailDB from '@/lib/db/email';

import { success, failure } from '@/types';
import type { ExtractResultType } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

async function updateHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return failure(res, 'Method not allowed', 405);
  }

  const { emailId, emailResult, emailType } = req.body;

  if (typeof emailId !== 'number' || !Number.isInteger(emailId) || emailId < 1) {
    return failure(res, 'Invalid email ID', 400);
  }

  if (typeof emailType !== 'string' || !emailType) {
    return failure(res, 'emailType is required and must be a string', 400);
  }

  const validTypes: ExtractResultType[] = ['auth_code', 'auth_link', 'service_link', 'subscription_link', 'other_link', 'internal_link', 'none'];
  if (!validTypes.includes(emailType as ExtractResultType)) {
    return failure(res, 'Invalid emailType', 400);
  }

  try {
    await emailDB.update({
      id: emailId,
      emailResult,
      emailType: emailType as ExtractResultType,
    });
    return success(res, null, 200);
  } catch (e) {
    console.error('Failed to update email:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return failure(res, errorMessage, 500);
  }
}

export default withAuth(updateHandler);
