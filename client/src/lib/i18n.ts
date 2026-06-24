import type { Lang } from '../../../shared/nevenshop-types';

export const LANGUAGES: { code: Lang; label: string; native: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', native: 'English', flag: 'en.png', dir: 'ltr' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: 'de.png', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: 'ar.png', dir: 'rtl' },
];

// Flag image paths (using manus-storage)
export const FLAG_URLS: Record<Lang, string> = {
  en: '/manus-storage/en_3bbd592b.png',
  de: '/manus-storage/de_eda86cba.png',
  ar: '/manus-storage/ar_24fff20b.png',
};

export function isValidLang(lang: string): lang is Lang {
  return LANGUAGES.some((l) => l.code === lang);
}

export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  return isValidLang(seg) ? seg : 'en';
}

export function localizePath(pathname: string, newLang: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (isValidLang(parts[0])) parts.shift();
  return `/${newLang}/${parts.join('/')}`;
}
