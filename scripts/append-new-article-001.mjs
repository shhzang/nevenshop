import fs from 'node:fs/promises';

const blogPath = 'server/data/blog.json';
const draftPath = 'research/new-article-001.json';
const articles = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const article = JSON.parse(await fs.readFile(draftPath, 'utf8'));

if (articles.some((item) => item.slug === article.slug || item.id === article.id)) {
  throw new Error(`Article already exists: ${article.slug}`);
}

articles.push(article);
await fs.writeFile(blogPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Added article ${article.id}: ${article.slug}`);
