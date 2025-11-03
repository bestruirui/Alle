import { useCallback, useEffect } from 'react';
import { useSettingsStore } from '../store/settings';
import { useI18nStore } from '../store/i18n';

export const useTranslation = () => {
    const { language } = useSettingsStore();
    const { loadTranslations, getCurrentTranslations, isLoading } = useI18nStore();

    // 监听语言变化，自动加载对应翻译
    useEffect(() => {
        void loadTranslations(language);
    }, [language, loadTranslations]);

    // 翻译函数 - 支持变量插值
    const translate = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            const translations = getCurrentTranslations();
            let text = translations[key] || key;

            if (params) {
                Object.keys(params).forEach((param) => {
                    text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]));
                });
            }

            return text;
        },
        [getCurrentTranslations]
    );

    return { t: translate, language, isLoading };
};

