import fs from 'node:fs/promises';

const blogPath = 'server/data/blog.json';
const articles = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const firstNewArticleId = 24;
const firstRelease = new Date('2026-08-17T00:00:00Z');

for (const article of articles) {
  if (article.id < firstNewArticleId || article.id > 123) continue;
  const batch = Math.floor((article.id - firstNewArticleId) / 10);
  const release = new Date(firstRelease);
  release.setUTCDate(release.getUTCDate() + batch * 7);
  article.published_at = release.toISOString().slice(0, 10);
}

await fs.writeFile(blogPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log('Applied weekly release dates to new-series Blog articles.');
