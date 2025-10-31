import type { ApiResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401, 'Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

interface ApiClientOptions extends RequestInit {
  authToken?: string;
}

export async function apiClient<T>(
  url: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { authToken, headers: initHeaders, ...fetchOptions } = options;
  const headers = new Headers(initHeaders ?? undefined);

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    throw new UnauthorizedError(response.statusText || 'Unauthorized');
  }

  let data: ApiResponse<T>;
  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Failed to parse response', response.status, response.statusText);
  }

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error ?? 'Request failed',
      response.status,
      response.statusText,
    );
  }

  return data.data as T;
}
