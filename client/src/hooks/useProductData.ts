import { useQuery } from '@tanstack/react-query';
import type { Product, Page } from '../../../shared/nevenshop-types';
import { useLanguage } from './useTranslations';

const API_BASE = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function useProductList() {
  const { currentLang } = useLanguage();
  return useQuery<Product[]>({
    queryKey: ['products', currentLang],
    queryFn: () => fetchJSON(`${API_BASE}/products?lang=${currentLang}`),
  });
}

export function useProduct(slug: string) {
  const { currentLang } = useLanguage();
  return useQuery<Product>({
    queryKey: ['product', slug, currentLang],
    queryFn: () => fetchJSON(`${API_BASE}/products/${slug}?lang=${currentLang}`),
    enabled: !!slug,
  });
}

export function usePage(slug: string) {
  const { currentLang } = useLanguage();
  return useQuery<Page>({
    queryKey: ['page', slug, currentLang],
    queryFn: () => fetchJSON(`${API_BASE}/pages/${slug}?lang=${currentLang}`),
    enabled: !!slug,
  });
}
