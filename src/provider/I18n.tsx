'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store/settings';
import { useI18nStore } from '@/lib/store/i18n';

/**
 * i18n Provider
 * 
 * 职责：在应用启动时预加载翻译文件
 * 
 * 优势：
 * 1. 单一职责 (SRP) - 只负责翻译初始化
 * 2. 提前加载 - 避免首次渲染时的加载延迟
 * 3. 透明集成 - 不影响其他组件的渲染
 * 4. 统一管理 - 与其他 Provider 保持一致的组织结构
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const { language } = useSettingsStore();
    const { loadTranslations } = useI18nStore();

    useEffect(() => {
        // 预加载当前语言的翻译
        void loadTranslations(language);
    }, [language, loadTranslations]);

    return <>{children}</>;
}

