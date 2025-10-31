import { useCallback, useEffect, useState } from 'react';
import { useSettingsStore } from './store/settings';

type Translations = Record<string, string>;

const translations: Record<string, Translations> = {};

export const loadTranslations = async (locale: string): Promise<Translations> => {
  if (translations[locale]) {
    return translations[locale];
  }

  try {
    const response = await fetch(`/locales/${locale}/common.json`);
    const data = (await response.json()) as Translations;
    translations[locale] = data;
    return data;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return {};
  }
};

export const useTranslation = () => {
  const { language } = useSettingsStore();
  const [t, setT] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    void loadTranslations(language).then((trans) => {
      setT(trans);
      setIsLoading(false);
    });
  }, [language]);

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = t[key] || key;

      if (params) {
        Object.keys(params).forEach((param) => {
          text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]));
        });
      }

      return text;
    },
    [t]
  );

  return { t: translate, language, isLoading };
};
