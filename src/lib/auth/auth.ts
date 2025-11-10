import { failure } from '@/types';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createHash } from 'crypto';
import { jwtVerify } from 'jose';

import type { NextApiRequest, NextApiResponse } from 'next';

async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      failure(res, 'Missing authorization header', 401);
      return false;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      failure(res, 'Invalid authorization header format', 401);
      return false;
    }

    const token = parts[1];

    const { env } = await getCloudflareContext();
    const USERNAME = env.USERNAME;
    const PASSWORD = env.PASSWORD;

    if (!USERNAME || !PASSWORD) {
      failure(res, 'Server not configured', 500);
      return false;
    }

    const secret = createHash('sha256').update(`${USERNAME}:${PASSWORD}`).digest('hex');
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    if (payload.sub !== USERNAME) {
      failure(res, 'Token user mismatch', 401);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Authentication error:', e);
    failure(res, 'Invalid or expired token', 401);
    return false;
  }
}

export default function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuthenticated = await authenticate(req, res); if (!isAuthenticated) return;

    return handler(req, res);
  };
}
