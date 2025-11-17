import { apiFetch, ApiError } from './client';

import type { Email, ApiResponse, ExtractResultType } from '@/types';

interface FetchEmailsParams {
    limit?: number;
    offset?: number;
    readStatus?: number;
    emailTypes?: ExtractResultType[];
    recipients?: string[];
}

export async function fetchEmails({
    limit = 50,
    offset = 0,
    readStatus,
    emailTypes = [],
    recipients = [],
}: FetchEmailsParams = {}) {
    const searchParams = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
    });

    if (typeof readStatus === 'number') {
        searchParams.set('read_status', String(readStatus));
    }

    if (emailTypes.length > 0) {
        searchParams.set('email_type', emailTypes.join(','));
    }

    if (recipients.length > 0) {
        searchParams.set('recipient', recipients.join(','));
    }

    const response = await apiFetch(`/api/email/list?${searchParams.toString()}`);

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

export async function fetchRecipients() {
    const response = await apiFetch('/api/email/recipients');

    if (!response.ok) {
        throw new ApiError('Failed to fetch recipients', response.status);
    }

    const data = (await response.json()) as ApiResponse<string[]>;

    if (!data.success || !data.data) {
        throw new ApiError(data.error || 'Failed to fetch recipients', response.status);
    }

    return data.data;
}

export async function mark(id: number, isRead: boolean) {
    const searchParams = new URLSearchParams({
        id: String(id),
        is_read: isRead ? '1' : '0',
    });

    const response = await apiFetch(`/api/email/mark?${searchParams.toString()}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new ApiError('Failed to update email read status', response.status);
    }

    const data = (await response.json()) as ApiResponse<null>;

    if (!data.success) {
        throw new ApiError(data.error || 'Failed to update email read status', response.status);
    }

    return { emailId: id, isRead };
}