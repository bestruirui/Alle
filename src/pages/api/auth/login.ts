import { success, failure } from '@/types';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createHash } from 'crypto';
import { SignJWT } from 'jose';

import type { LoginRequestBody, LoginResponseData } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return failure(res, 'Method not allowed', 405);
  }

  try {
    const { env } = await getCloudflareContext();

    const USERNAME = env.USERNAME;
    const PASSWORD = env.PASSWORD;
    const JWT_MIN_TTL = Number(env.JWT_MIN_TTL || 300);
    const JWT_MAX_TTL = Number(env.JWT_MAX_TTL || 6000);

    if (!USERNAME || !PASSWORD) {
      return failure(res, 'Server not configured', 500);
    }

    const body = req.body as LoginRequestBody;
    if (!body || typeof body !== 'object' || !body.username || typeof body.username !== 'string' || !body.password || typeof body.password !== 'string' || body.username !== USERNAME || body.password !== PASSWORD) {
      return failure(res, 'Invalid Password or Username', 401);
    }

    const now = Math.floor(Date.now() / 1000);
    let payload: {
      sub: string;
      iat: number;
      exp?: number;
    };

    if (body.expired === 'none') {
      payload = {
        sub: body.username,
        iat: now,
      };
    } else if (typeof body.expired === 'number') {
      const ttl = Math.max(JWT_MIN_TTL, Math.min(body.expired, JWT_MAX_TTL));
      payload = {
        sub: body.username,
        iat: now,
        exp: now + ttl,
      };
    } else {
      payload = {
        sub: body.username,
        iat: now,
        exp: now + JWT_MIN_TTL,
      };
    }

    const secret = createHash('sha256').update(`${USERNAME}:${PASSWORD}`).digest('hex');
    const secretKey = new TextEncoder().encode(secret);

    const jwt = new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt();

    if (payload.exp) {
      jwt.setExpirationTime(payload.exp);
    }

    const token = await jwt.sign(secretKey);

    return success<LoginResponseData>(res, { token, exp: payload.exp ?? null }, 200);
  } catch (e) {
    console.error('Failed to generate JWT:', e);
    return failure(res, 'Failed to generate token', 500);
  }
}
