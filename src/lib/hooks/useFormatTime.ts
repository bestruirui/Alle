import useTranslation from '@/lib/hooks/useTranslation';

import { useMemo } from 'react';

export default function useFormatTime() {
    const { t } = useTranslation();

    return useMemo(() => {
        return (sentAt: string | null, now: number = Date.now()): string => {
            if (!sentAt) return '';

            const date = new Date(sentAt);
            if (Number.isNaN(date.getTime())) return '';

            const diffMs = now - date.getTime();
            const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

            // 计算时间差
            const minutes = Math.floor(diffSeconds / 60);
            const hours = Math.floor(diffSeconds / 3600);
            const days = Math.floor(diffSeconds / 86400);

            // 使用 i18n 翻译
            if (diffSeconds < 60) return t('timeJustNow');
            if (diffSeconds < 3600) return t('timeMinutesAgo', { minutes: String(minutes) });
            if (diffSeconds < 86400) return t('timeHoursAgo', { hours: String(hours) });
            if (diffSeconds < 604800) return t('timeDaysAgo', { days: String(days) });

            // 超过 7 天显示完整日期（使用浏览器默认 locale）
            return date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== new Date(now).getFullYear() ? 'numeric' : undefined,
            });
        };
    }, [t]);
}

