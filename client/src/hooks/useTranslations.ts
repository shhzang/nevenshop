import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Lang } from '../../../shared/nevenshop-types';
import { isValidLang } from '../lib/i18n';

export function useLanguage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang;
  const currentLang: Lang = lang && isValidLang(lang) ? lang : 'en';
  const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  return { currentLang, dir };
}

export function useTranslations() {
  const { currentLang } = useLanguage();
  const { data: dict } = useQuery<Record<string, string>>({
    queryKey: ['translations', currentLang],
    queryFn: () => fetch(`/api/translations/${currentLang}`).then((r) => r.json()),
    staleTime: Infinity,
    enabled: currentLang !== 'en',
  });
  const t = (key: string): string => {
    if (currentLang === 'en') return key;
    if (!dict) return key;
    return dict[key] || key;
  };
  return { lang: currentLang, t };
}
