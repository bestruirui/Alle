import { useCallback, useEffect } from 'react';
import { useSettingsStore } from '../store/settings';
import { useI18nStore } from '../store/i18n';

export const useTranslation = () => {
    const { language } = useSettingsStore();
    const { loadTranslations, getCurrentTranslations, isLoading, currentLocale } = useI18nStore();

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
        [getCurrentTranslations, currentLocale] // 依赖 currentLocale 确保语言切换时重新计算
    );

    return { t: translate, language, isLoading };
};

