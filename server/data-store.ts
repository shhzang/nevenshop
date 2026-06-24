import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');

function loadJSON(filename: string) {
  const content = readFileSync(join(DATA_DIR, filename), 'utf-8');
  return JSON.parse(content);
}

// Load all data at startup
let products: any[] = [];
let pages: any[] = [];
let translations: Record<string, Record<string, string>> = {};
let menus: any = {};
let tokens: any = {};
let mediaMap: Record<string, { url: string }> = {};

function init() {
  console.log('[data-store] Loading data...');
  const rawProducts = loadJSON('products.json');
  const rawPages = loadJSON('pages.json');
  mediaMap = loadJSON('media-map.json');

  // Resolve image IDs in products
  products = rawProducts.map((p: any) => {
    const resolved = { ...p };
    if (p.thumbnail) resolved.thumbnail = resolveImageId(p.thumbnail) || p.thumbnail;
    if (p.images) resolved.images = resolveImageIds(p.images);
    if (p.content_blocks) resolveContentBlockImages(p.content_blocks);
    return resolved;
  });

  // Resolve image IDs in pages
  pages = rawPages.map((p: any) => {
    const resolved = { ...p };
    if (p.content_blocks) resolveContentBlockImages(p.content_blocks);
    return resolved;
  });

  translations = loadJSON('translations.json');
  menus = loadJSON('menus.json');
  tokens = loadJSON('design-tokens.json');
  console.log('[data-store] All data loaded.');
}

function resolveImageId(id: string | number | undefined | null): string {
  if (!id) return '';
  const key = String(id);
  // If it's already a URL path (starts with /manus-storage or /uploads), return as-is
  if (key.startsWith('/')) return key;
  return mediaMap[key]?.url || '';
}

function resolveImageIds(ids: (string | number)[]): string[] {
  return ids.map((id) => resolveImageId(id)).filter(Boolean);
}

function resolveContentBlockImages(blocks: any[]) {
  if (!blocks) return;
  for (const block of blocks) {
    if ((block.type === 'fusion_imageframe' || block.type === 'fusion_image') && block.attrs?.image_id) {
      const id = String(block.attrs.image_id).split('|')[0];
      const url = resolveImageId(id);
      if (url) block.attrs.src = url;
    }
    if (block.children) resolveContentBlockImages(block.children);
    if (block.tabs) {
      for (const tab of block.tabs) {
        resolveContentBlockImages(tab.children);
      }
    }
  }
}

// ─── Translation helpers ────────────────────────────────────────────────────

const mergedDicts: Record<string, Record<string, string>> = {};

function getMergedDict(lang: string): Record<string, string> {
  if (mergedDicts[lang]) return mergedDicts[lang];
  const dict: Record<string, string> = {};
  const gettextKey = `${lang}_gettext`;
  if (translations[gettextKey]) Object.assign(dict, translations[gettextKey]);
  if (translations[lang]) Object.assign(dict, translations[lang]);
  for (const key of Object.keys(dict)) {
    const decoded = stripHtml(key);
    if (decoded !== key && !(decoded in dict)) dict[decoded] = dict[key];
    const normalized = normalizeText(decoded !== key ? decoded : key);
    if (normalized !== decoded && normalized !== key && !(normalized in dict)) dict[normalized] = dict[key];
  }
  mergedDicts[lang] = dict;
  return dict;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .trim();
}

function normalizeText(text: string): string {
  return text
    .replace(/[''′]/g, "'")
    .replace(/[""″]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/ /g, ' ')
    .replace(/[…⋯]/g, '...');
}

function escapeRx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translateSegment(html: string, lang: string): string {
  if (!html) return html;
  const dict = getMergedDict(lang);
  const plain = stripHtml(html);
  if (!plain || plain.length < 3) return html;
  const plainNorm = normalizeText(plain);
  const exact = dict[plain] || (plainNorm !== plain ? dict[plainNorm] : undefined);
  if (exact) {
    if (html.includes(plain)) return html.replace(plain, exact);
    const reEncoded = plain.replace(/&/g, '&amp;').replace(/′/g, '&#8217;');
    if (html.includes(reEncoded)) return html.replace(reEncoded, exact);
    return exact;
  }
  // Case-insensitive match
  const lowerPlain = plain.toLowerCase();
  for (const key of Object.keys(dict)) {
    if (key.toLowerCase() === lowerPlain) {
      const translated = dict[key];
      if (html.includes(plain)) return html.replace(plain, translated);
      return translated;
    }
  }
  // Substring match
  const matches: { key: string; translated: string }[] = [];
  for (const key of Object.keys(dict)) {
    if (key.length > 10 && plainNorm.includes(key)) {
      matches.push({ key, translated: dict[key] });
    }
  }
  if (matches.length > 0) {
    matches.sort((a, b) => b.key.length - a.key.length);
    let result = html;
    for (const { key, translated } of matches) {
      if (result.includes(key)) result = result.replace(new RegExp(escapeRx(key), 'g'), translated);
    }
    return result;
  }
  return html;
}

function translateTextContent(html: string, lang: string): string {
  if (!html) return html;
  if (/<\/?p[>\s]/.test(html)) {
    const parts = html.split(/(<p[^>]*>|<\/p>)/g);
    const result: string[] = [];
    let inPara = false;
    let paraContent = '';
    for (const part of parts) {
      if (/^<p[^>]*>$/.test(part)) {
        inPara = true;
        paraContent = '';
        result.push(part);
      } else if (part === '</p>') {
        if (paraContent) result.push(translateSegment(paraContent, lang));
        result.push(part);
        inPara = false;
        paraContent = '';
      } else if (inPara) {
        paraContent += part;
      } else {
        result.push(part);
      }
    }
    return result.join('');
  }
  return translateSegment(html, lang);
}

function translateContentBlocks(blocks: any[], lang: string): any[] {
  if (!blocks) return blocks;
  return blocks.map((block) => {
    const b = { ...block };
    if (b.type === 'text' && b.content) b.content = translateTextContent(b.content, lang);
    if (b.children) b.children = translateContentBlocks(b.children, lang);
    if (b.tabs) b.tabs = b.tabs.map((tab: any) => ({
      ...tab,
      children: translateContentBlocks(tab.children, lang),
    }));
    for (const attr of ['heading_text', 'subheading_text', 'title', 'description', 'text_content', 'text']) {
      if (b.attrs?.[attr]) {
        b.attrs = { ...b.attrs, [attr]: translateTextContent(b.attrs[attr], lang) };
      }
    }
    return b;
  });
}

function translateField(item: any, lang: string, field: string): string {
  const original = item[field];
  if (!original) return original;
  const trans = item.translations?.[lang]?.[original];
  return trans || original;
}

function translateProduct(product: any, lang: string): any {
  return {
    ...product,
    title: translateField(product, lang, 'title'),
    excerpt: translateField(product, lang, 'excerpt'),
    description: translateField(product, lang, 'description'),
    content_blocks: translateContentBlocks(product.content_blocks, lang),
  };
}

function translatePage(page: any, lang: string): any {
  return {
    ...page,
    title: translateField(page, lang, 'title'),
    excerpt: translateField(page, lang, 'excerpt'),
    raw_content: translateField(page, lang, 'raw_content'),
    content_blocks: translateContentBlocks(page.content_blocks, lang),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function getProducts(lang?: string) {
  if (!lang || lang === 'en') return products;
  return products.map((p) => translateProduct(p, lang));
}

export function getProductBySlug(slug: string, lang?: string) {
  const product = products.find((p) => p.slug === slug) || null;
  if (!product || !lang || lang === 'en') return product;
  return translateProduct(product, lang);
}

export function getPages(lang?: string) {
  if (!lang || lang === 'en') return pages;
  return pages.map((p) => translatePage(p, lang));
}

export function getPageBySlug(slug: string, lang?: string) {
  const page = pages.find((p) => p.slug === slug) || null;
  if (!page || !lang || lang === 'en') return page;
  return translatePage(page, lang);
}

export function getTranslations(lang: string): Record<string, string> {
  return getMergedDict(lang);
}

export function getMenus() {
  return menus;
}

export function getDesignTokens() {
  return tokens;
}

// Initialize on module load
init();
