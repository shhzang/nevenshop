import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

interface BlogEntry {
  id: number;
  date?: string;
  published_at?: string;
}

const blogPath = path.join(process.cwd(), 'server', 'data', 'blog.json');

function sortKey(entry: BlogEntry): string {
  return `${entry.date ?? ''}|${entry.published_at ?? ''}|${String(entry.id).padStart(12, '0')}`;
}

describe('blog ordering', () => {
  it('places the newest public article first and keeps the full article set', () => {
    const articles = JSON.parse(fs.readFileSync(blogPath, 'utf8')) as BlogEntry[];
    expect(articles).toHaveLength(224);
    expect(articles[0]).toMatchObject({ id: 224, date: '2026-11-21' });
    expect(articles.at(-1)).toMatchObject({ id: 3, date: '2026-07-05' });

    const keys = articles.map(sortKey);
    expect(keys).toEqual([...keys].sort().reverse());
    expect(new Set(articles.map((article) => article.id)).size).toBe(224);
  });

  it('keeps the 20-article editorial batch transparent and complete', () => {
    const articles = JSON.parse(fs.readFileSync(blogPath, 'utf8')) as Array<BlogEntry & {
      slug: string;
      featured_image: string;
      seo: Record<string, unknown>;
      translations: Record<string, { title: string; excerpt: string; content: string }>;
    }>;
    const batch = articles.filter((article) => article.id >= 205 && article.id <= 224);
    expect(batch).toHaveLength(20);
    expect(batch.every((article) => article.date === '2026-11-21')).toBe(true);
    expect(batch.every((article) => article.published_at === '2026-11-21T09:55:00Z')).toBe(true);
    expect(new Set(batch.map((article) => article.slug)).size).toBe(20);
    expect(batch.every((article) => article.featured_image.startsWith('/manus-storage/'))).toBe(true);
    expect(batch.every((article) => Object.keys(article.seo).sort().join(',') === 'ar,de,en')).toBe(true);
    expect(batch.every((article) => Object.keys(article.translations).sort().join(',') === 'ar,de,en')).toBe(true);
    expect(batch.every((article) => Object.values(article.translations).every((entry) => entry.content.length > 400))).toBe(true);
  });
});
