import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cache } from 'react';

export const getDb = cache((): DrizzleD1Database => {
  const { env } = getCloudflareContext();
  return drizzle(env.DB);
});
