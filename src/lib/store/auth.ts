import { create } from 'zustand';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

/**
 * 认证状态管理 Store
 * 单一职责：统一管理 token 和登录状态
 */
export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isAuthenticated: false,

    // 设置 token 并更新认证状态
    setToken: (token: string) => {
        localStorage.setItem('auth_token', token);
        set({ token, isAuthenticated: true });
    },

    // 登出：清除 token 和认证状态
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, isAuthenticated: false });
    },

    // 初始化：从 localStorage 恢复 token
    initAuth: () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            set({ token, isAuthenticated: true });
        }
    },
}));

