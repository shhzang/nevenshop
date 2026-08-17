import fs from 'node:fs/promises';

const draftPath = process.argv[2];
if (!draftPath) throw new Error('Usage: node scripts/append-blog-draft.mjs research/new-article-xxx.json');

const blogPath = 'server/data/blog.json';
const articles = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const article = JSON.parse(await fs.readFile(draftPath, 'utf8'));

if (articles.some((item) => item.slug === article.slug || item.id === article.id)) {
  throw new Error(`Article already exists: ${article.slug}`);
}
if (!article.featured_image?.startsWith('/manus-storage/')) {
  throw new Error(`Article has no managed image path: ${article.slug}`);
}

articles.push(article);
await fs.writeFile(blogPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Added article ${article.id}: ${article.slug}`);
