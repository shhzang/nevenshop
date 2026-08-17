import fs from 'node:fs/promises';

const paths = process.argv.slice(2);
if (paths.length === 0) throw new Error('Usage: node scripts/audit-blog-drafts.mjs research/new-article-xxx.json [...]');

for (const path of paths) {
  const article = JSON.parse(await fs.readFile(path, 'utf8'));
  const errors = [];
  const primary = article.seo?.en?.keywords?.split(',')[0]?.trim().toLowerCase();
  for (const lang of ['en', 'de', 'ar']) {
    const translation = article.translations?.[lang];
    const seo = article.seo?.[lang];
    if (!translation?.content || translation.content.length < 1800) errors.push(`${lang}: content below 1800 characters`);
    if (!translation?.content?.includes('http')) errors.push(`${lang}: missing further-reading source URL`);
    if (!seo?.title || !seo?.description || !seo?.keywords) errors.push(`${lang}: incomplete SEO fields`);
  }
  if (!article.translations?.en?.content?.slice(0, 1000).toLowerCase().includes(primary)) errors.push('en: primary keyword absent from opening');
  const result = { id: article.id, slug: article.slug, primaryKeyword: primary, imagePending: !article.featured_image, errors };
  console.log(JSON.stringify(result));
  if (errors.length) process.exitCode = 1;
}
