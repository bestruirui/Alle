import useAuthStore from '@/lib/store/auth';

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public isAuthError: boolean = false
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function apiFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = useAuthStore.getState().token;

    // 自动添加 Authorization header
    const headers = new Headers(options.headers);
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // 处理 401 错误：token 过期或无效
        if (response.status === 401) {
            // 自动登出并清除 token
            useAuthStore.getState().logout();
            throw new ApiError('认证已过期，请重新登录', 401, true);
        }

        return response;
    } catch (error) {
        // 如果是 ApiError，直接抛出
        if (error instanceof ApiError) {
            throw error;
        }

        // 网络错误或其他错误
        throw new ApiError(
            error instanceof Error ? error.message : '网络请求失败',
            0,
            false
        );
    }
}

