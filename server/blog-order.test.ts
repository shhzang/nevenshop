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
    expect(articles).toHaveLength(204);
    expect(articles[0]).toMatchObject({ id: 199, date: '2026-11-02' });
    expect(articles.at(-1)).toMatchObject({ id: 3, date: '2026-07-05' });

    const keys = articles.map(sortKey);
    expect(keys).toEqual([...keys].sort().reverse());
    expect(new Set(articles.map((article) => article.id)).size).toBe(204);
  });
});
