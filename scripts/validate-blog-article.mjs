import fs from 'node:fs/promises';

const slug = process.argv[2];
if (!slug) throw new Error('Usage: node scripts/validate-blog-article.mjs <slug>');

const articles = JSON.parse(await fs.readFile('server/data/blog.json', 'utf8'));
const article = articles.find((item) => item.slug === slug);
if (!article) throw new Error(`Article not found: ${slug}`);
if (!article.featured_image?.startsWith('/manus-storage/')) throw new Error('Missing managed cover image path');

for (const language of ['en', 'de', 'ar']) {
  const content = article.translations?.[language]?.content ?? '';
  const title = article.translations?.[language]?.title ?? '';
  const excerpt = article.translations?.[language]?.excerpt ?? '';
  const seo = article.seo?.[language];
  if (!title || !excerpt || !content) throw new Error(`Missing ${language} content fields`);
  if (!seo?.title || !seo?.description || !seo?.keywords) throw new Error(`Missing ${language} SEO fields`);
  if (content.length < 1800) throw new Error(`${language} content is too short for a substantive article`);
  if (!/https:\/\/(?:www\.)?(?:epa\.gov|fda\.gov|faa\.gov|gov\.uk|ec\.europa\.eu)/i.test(content)) {
    throw new Error(`${language} content has no official source link`);
  }
}

const englishKeyword = article.seo.en.keywords.split(',')[0].trim().toLowerCase();
const englishContent = article.translations.en.content.toLowerCase();
if (!article.translations.en.title.toLowerCase().includes(englishKeyword.split(' ')[0])) {
  throw new Error('Primary English keyword is not represented in the title');
}
if (!englishContent.slice(0, 1000).includes(englishKeyword)) {
  throw new Error('Primary English keyword is not present early in the article');
}

console.log(`Validated ${slug}: 3 languages, substantive content, SEO, source, keyword placement and managed image.`);
