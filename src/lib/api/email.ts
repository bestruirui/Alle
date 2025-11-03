import { apiFetch, ApiError } from './client';
import type { Email, ApiResponse } from '@/types';

/**
 * 获取邮件列表
 */
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

/**
 * 删除单个邮件
 */
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

/**
 * 批量删除邮件
 */
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

