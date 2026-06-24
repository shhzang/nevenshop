export interface Product {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  images: (string | number)[];
  content_blocks: ContentBlock[];
  translations: Record<string, Record<string, string>>;
  meta: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface ContentBlock {
  type: string;
  attrs: Record<string, any>;
  content?: string;
  children: ContentBlock[];
  tabs?: TabBlock[];
}

export interface TabBlock {
  attrs: Record<string, any>;
  children: ContentBlock[];
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_blocks: ContentBlock[];
  raw_content: string;
}

export interface DesignTokens {
  colors: Record<string, { label: string; color: string }>;
  primary_color: string;
  site_width: string;
  content_break_point: string;
  grid_main_break_point: string;
  main_padding: { top: string; bottom: string } | null;
  fonts: string[];
}

export interface Menu {
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  title: string;
  type: string;
  url: string;
  parent: number;
}

export type Lang = 'en' | 'de' | 'ar';

export interface TranslationDict {
  [key: string]: string;
}
