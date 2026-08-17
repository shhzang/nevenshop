import fs from 'node:fs/promises';

const draftPath = process.argv[2];
if (!draftPath) throw new Error('Usage: node scripts/append-blog-draft.mjs research/new-article-xxx.json');

const blogPath = 'server/data/blog.json';
const articles = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const article = JSON.parse(await fs.readFile(draftPath, 'utf8'));

function releaseDateForArticle(id) {
  const firstNewArticleId = 24;
  const firstRelease = new Date('2026-08-17T00:00:00Z');
  if (id < firstNewArticleId || id > 123) return undefined;
  const batch = Math.floor((id - firstNewArticleId) / 10);
  const release = new Date(firstRelease);
  release.setUTCDate(release.getUTCDate() + batch * 7);
  return release.toISOString().slice(0, 10);
}

if (articles.some((item) => item.slug === article.slug || item.id === article.id)) {
  throw new Error(`Article already exists: ${article.slug}`);
}
if (!article.featured_image?.startsWith('/manus-storage/')) {
  throw new Error(`Article has no managed image path: ${article.slug}`);
}

article.published_at ??= releaseDateForArticle(article.id);

articles.push(article);
await fs.writeFile(blogPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Added article ${article.id}: ${article.slug}`);
