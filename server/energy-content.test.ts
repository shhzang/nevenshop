import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

type BlogPost = {
  id: number;
  slug: string;
  featured_image: string;
  seo: Record<string, { title: string; description: string; keywords: string }>;
  translations: Record<string, { title: string; excerpt: string; content: string }>;
};

type Product = {
  id: number;
  slug: string;
  thumbnail: string;
  images: string[];
  content_blocks: unknown[];
};

const dataPath = (name: string) => path.join(process.cwd(), 'server', 'data', name);

function load<T>(name: string): T {
  return JSON.parse(fs.readFileSync(dataPath(name), 'utf8')) as T;
}

describe('energy-type content additions', () => {
  it('keeps the two image-record products separate and image-backed', () => {
    const products = load<Product[]>('products.json');
    const added = products.filter((p) => p.id >= 6165);

    expect(added).toHaveLength(2);
    expect(new Set(added.map((p) => p.slug))).toEqual(new Set([
      'neven-red-bull-18000-peach-winter-tropical-disposable-vape',
      'neven-red-bull-18000-white-edition-coconut-acai-disposable-vape',
    ]));
    for (const product of added) {
      expect(product.title).toContain('NEVEN Red Bull 18000');
      expect(product.thumbnail).toMatch(/^\/manus-storage\/(wala-yo-18000|vapsolo-dg18000)-red-bull-authorized_.*\.webp$/);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images).toEqual([product.thumbnail]);
      expect(product.content_blocks).toHaveLength(5);
      const detail = JSON.stringify(product.content_blocks);
      expect(detail).toContain('SEND EMAIL TO US');
      expect(detail).toContain('Product Detail');
      expect(detail).toContain('Leave Your Message');
      expect(detail).toContain('18000 puffs');
      expect(detail).not.toMatch(/(?<!0)1800(?!0)/);
      expect(detail).toContain('mailto:neven6000@gmail.com');
      const imageSources = [...detail.matchAll(/"src":"([^"\\]+)"/g)].map((match) => match[1]);
      expect(imageSources.length).toBeGreaterThan(0);
      expect(new Set(imageSources)).toEqual(new Set([product.thumbnail]));
      expect(detail).not.toContain('image_id');
    }
  });

  it('contains ten new posts with complete EN/DE/AR SEO and body fields', () => {
    const posts = load<BlogPost[]>('blog.json');
    const added = posts.filter((post) => post.id >= 190 && post.id < 200);

    expect(added).toHaveLength(10);
    expect(new Set(added.map((post) => post.featured_image))).toEqual(new Set([
      '/manus-storage/wala-yo-18000-red-bull-authorized_796bfb87.webp',
      '/manus-storage/vapsolo-dg18000-red-bull-authorized_65ef6aa2.webp',
    ]));
    for (const post of added) {
      expect(post.featured_image).toMatch(/^\/manus-storage\//);
      expect(post.featured_image).toMatch(/\.webp$/);
      expect(Object.keys(post.seo).sort()).toEqual(['ar', 'de', 'en']);
      expect(Object.keys(post.translations).sort()).toEqual(['ar', 'de', 'en']);
      for (const lang of ['en', 'de', 'ar']) {
        expect(post.seo[lang].title.length).toBeGreaterThan(10);
        expect(post.seo[lang].keywords.length).toBeGreaterThan(10);
        expect(post.translations[lang].content.length).toBeGreaterThan(200);
      }
    }
  });

  it('does not present the pictured products as verified energy or wellness products', () => {
    const posts = load<BlogPost[]>('blog.json').filter((post) => post.id >= 190 && post.id < 200);
    const combined = posts.map((post) => post.translations.en.content).join('\n');

    expect(combined).toContain('not verified');
    expect(combined).toContain('unverified');
    expect(combined).toContain('FDA');
    expect(combined).toContain('EU Tobacco Products Directive');
  });
  it('adds five Arabic posts between the existing English-led date bands', () => {
    const posts = load<BlogPost[]>('blog.json');
    const added = posts.filter((post) => post.id >= 200 && post.id <= 204);
    expect(added).toHaveLength(5);
    expect(added.every((post) => post.translations.ar.title.length > 10)).toBe(true);
    expect(added.every((post) => post.translations.ar.content.length > 400)).toBe(true);
    expect(added.every((post) => post.seo.ar.keywords.length > 10)).toBe(true);
    const positions = new Map(posts.map((post, index) => [post.id, index]));
    expect(positions.get(200)).toBeGreaterThan(positions.get(199)!);
    expect(positions.get(200)).toBeLessThan(positions.get(198)!);
    expect(positions.get(201)).toBeGreaterThan(positions.get(197)!);
    expect(positions.get(201)).toBeLessThan(positions.get(196)!);
    expect(positions.get(202)).toBeGreaterThan(positions.get(195)!);
    expect(positions.get(202)).toBeLessThan(positions.get(194)!);
    expect(positions.get(203)).toBeGreaterThan(positions.get(193)!);
    expect(positions.get(203)).toBeLessThan(positions.get(192)!);
    expect(positions.get(204)).toBeGreaterThan(positions.get(191)!);
    expect(positions.get(204)).toBeLessThan(positions.get(190)!);
  });
  it('keeps the product-detail route ahead of the product-list and language-home routes', () => {
    const app = fs.readFileSync(path.join(process.cwd(), 'client', 'src', 'App.tsx'), 'utf8');
    expect(app.indexOf('path="/:lang/products/:slug"')).toBeGreaterThan(-1);
    expect(app.indexOf('path="/:lang/products/:slug"')).toBeLessThan(app.indexOf('path="/:lang/products"'));
    expect(app.indexOf('path="/:lang/products/:slug"')).toBeLessThan(app.indexOf('path="/:lang"'));
  });
});
