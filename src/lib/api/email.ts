import { apiClient } from './client';
import type { EmailList } from '@/types';

export interface EmailListParams {
  limit?: number;
  offset?: number;
}

export async function fetchEmailList(
  token: string,
  params: EmailListParams,
): Promise<EmailList> {
  const queryParams = new URLSearchParams();

  if (params.limit !== undefined) {
    queryParams.set('limit', params.limit.toString());
  }

  if (params.offset !== undefined) {
    queryParams.set('offset', params.offset.toString());
  }

  const url = `/api/email/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return apiClient<EmailList>(url, { authToken: token });
}

export async function deleteEmails(
  token: string,
  emailIds: number[],
): Promise<null> {
  return apiClient<null>('/api/email/delete', {
    method: 'DELETE',
    body: JSON.stringify(emailIds),
    authToken: token,
  });
}
