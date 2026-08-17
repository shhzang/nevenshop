import fs from 'node:fs/promises';

const draftPath = process.argv[2];
if (!draftPath) throw new Error('Usage: node scripts/sync-blog-draft.mjs research/new-article-xxx.json');

const blogPath = 'server/data/blog.json';
const articles = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const article = JSON.parse(await fs.readFile(draftPath, 'utf8'));
const index = articles.findIndex((item) => item.slug === article.slug || item.id === article.id);

if (index < 0) throw new Error(`Article is not in blog data: ${article.slug}`);
articles[index] = article;
await fs.writeFile(blogPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Updated article ${article.id}: ${article.slug}`);
