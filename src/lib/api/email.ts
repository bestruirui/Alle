import { apiFetch, ApiError } from './client';

import type { Email, ApiResponse, ExtractResultType } from '@/types';

export async function fetchEmails(limit = 50, offset = 0) {
    const response = await apiFetch(`/api/email/list?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
        throw new ApiError('Failed to fetch emails', response.status);
    }

    const data = (await response.json()) as ApiResponse<Email[]>;

    if (!data.success || !data.data) {
        throw new ApiError(data.error || 'Failed to fetch emails', response.status);
    }

    return {
        emails: data.data,
        total: data.total || 0,
    };
}

export async function deleteEmail(emailId: number) {
    const response = await apiFetch('/api/email/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([emailId]),
    });

    const data = (await response.json()) as ApiResponse<null>;

    if (!data.success) {
        throw new ApiError(data.error || 'Failed to delete email', response.status);
    }

    return emailId;
}

export async function batchDeleteEmails(emailIds: number[]) {
    const response = await apiFetch('/api/email/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailIds),
    });

    const data = (await response.json()) as ApiResponse<null>;

    if (!data.success) {
        throw new ApiError(data.error || 'Failed to delete emails', response.status);
    }

    return emailIds;
}

export async function updateEmail(emailId: number, emailResult: string | null, emailType: ExtractResultType) {
    const response = await apiFetch('/api/email/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId, emailResult, emailType }),
    });

    const data = (await response.json()) as ApiResponse<null>;

    if (!data.success) {
        throw new ApiError(data.error || 'Failed to update email', response.status);
    }

    return { emailId, emailResult, emailType };
}

