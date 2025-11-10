'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store/settings';
import useI18nStore from '@/lib/store/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const { language } = useSettingsStore();
    const { loadTranslations } = useI18nStore();

    useEffect(() => {
        // 预加载当前语言的翻译
        void loadTranslations(language);
    }, [language, loadTranslations]);

    return <>{children}</>;
}

