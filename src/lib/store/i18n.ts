import { create } from 'zustand';

type Translations = Record<string, string>;

interface I18nState {
    translations: Record<string, Translations>; // 缓存多语言数据 { 'zh': {...}, 'en': {...} }
    currentLocale: string;
    isLoading: boolean;
    loadingPromises: Record<string, Promise<Translations>>; // 防止重复请求
    loadTranslations: (locale: string) => Promise<Translations>;
    getCurrentTranslations: () => Translations;
}

const useI18nStore = create<I18nState>((set, get) => ({
    translations: {},
    currentLocale: 'zh',
    isLoading: false,
    loadingPromises: {},

    loadTranslations: async (locale: string): Promise<Translations> => {
        const state = get();

        // 1. 如果已缓存，直接返回
        if (state.translations[locale]) {
            return state.translations[locale];
        }

        // 2. 如果正在加载中，返回现有 Promise（防止重复请求）
        if (locale in state.loadingPromises) {
            return state.loadingPromises[locale];
        }

        // 3. 创建新的加载 Promise
        const loadingPromise = (async () => {
            set({ isLoading: true, currentLocale: locale });

            try {
                const response = await fetch(`/locales/${locale}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = (await response.json()) as Translations;

                // 更新缓存
                set((state) => ({
                    translations: {
                        ...state.translations,
                        [locale]: data,
                    },
                    isLoading: false,
                    currentLocale: locale,
                }));

                // 清理 Promise 缓存
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [locale]: _, ...rest } = state.loadingPromises;
                    return { loadingPromises: rest };
                });

                return data;
            } catch (error) {
                console.error(`Failed to load translations for ${locale}:`, error);
                set({ isLoading: false });

                // 清理失败的 Promise
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [locale]: _, ...rest } = state.loadingPromises;
                    return { loadingPromises: rest };
                });

                // 返回空对象作为降级
                return {};
            }
        })();

        // 缓存 Promise
        set((state) => ({
            loadingPromises: {
                ...state.loadingPromises,
                [locale]: loadingPromise,
            },
        }));

        return loadingPromise;
    },

    /**
     * 获取当前语言的翻译数据
     */
    getCurrentTranslations: () => {
        const state = get();
        return state.translations[state.currentLocale] || {};
    },
}));

export default useI18nStore;

