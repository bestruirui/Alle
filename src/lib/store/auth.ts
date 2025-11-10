import { create } from 'zustand';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
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

export default useAuthStore;

