import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { cache } from 'react';

import type { DrizzleD1Database } from 'drizzle-orm/d1';

export const getDb = cache((): DrizzleD1Database => {
  const { env } = getCloudflareContext();
  return drizzle(env.DB);
});


export const getDbFromEnv = cache((env: CloudflareEnv): DrizzleD1Database => {
  return drizzle(env.DB);
});