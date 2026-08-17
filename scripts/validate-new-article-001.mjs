import fs from 'node:fs/promises';

const articles = JSON.parse(await fs.readFile('server/data/blog.json', 'utf8'));
const article = articles.find((item) => item.slug === 'vape-collection-program-retailer-guide-2026');
if (!article) throw new Error('Article 001 is missing from blog.json');
if (!article.featured_image.startsWith('/manus-storage/')) throw new Error('Article 001 has no managed image path');

for (const language of ['en', 'de', 'ar']) {
  const translation = article.translations?.[language];
  const seo = article.seo?.[language];
  if (!translation?.title || !translation?.excerpt || !translation?.content) throw new Error(`Missing ${language} content fields`);
  if (!seo?.title || !seo?.description || !seo?.keywords) throw new Error(`Missing ${language} SEO fields`);
  if (translation.content.length < 2500) throw new Error(`${language} content is too short for the planned long-form article`);
  if (!translation.content.includes('https://www.epa.gov/')) throw new Error(`${language} content is missing the source link`);
}

console.log('Article 001 validation passed: 3 languages, SEO, source and managed cover image present.');
