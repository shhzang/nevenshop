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
      'image-record-red-bull-marked-1800-puff-disposable-device',
      'image-record-red-bull-marked-white-edition-disposable-device',
    ]));
    for (const product of added) {
      expect(product.thumbnail).toMatch(/^\/manus-storage\/red-bull-.*-product_.*\.webp$/);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images).toEqual([product.thumbnail]);
      expect(product.content_blocks.length).toBeGreaterThan(0);
    }
  });

  it('contains ten new posts with complete EN/DE/AR SEO and body fields', () => {
    const posts = load<BlogPost[]>('blog.json');
    const added = posts.filter((post) => post.id >= 190);

    expect(added).toHaveLength(10);
    expect(new Set(added.map((post) => post.featured_image))).toEqual(new Set([
      '/manus-storage/energy-vape-pack-blog_ce513d36.webp',
      '/manus-storage/energy-vape-white-blog_5fc76275.webp',
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
    const posts = load<BlogPost[]>('blog.json').filter((post) => post.id >= 190);
    const combined = posts.map((post) => post.translations.en.content).join('\n');

    expect(combined).toContain('not verified');
    expect(combined).toContain('unverified');
    expect(combined).toContain('FDA');
    expect(combined).toContain('EU Tobacco Products Directive');
  });
});
