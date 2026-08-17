import { getBlogArticleBySlug, getBlogArticles } from '../server/blog-seo.ts';

const publishedNow = getBlogArticles();
const allArticles = getBlogArticles({ includeScheduled: true });
const scheduled = allArticles.filter((article) => !publishedNow.some((item) => item.slug === article.slug));

if (allArticles.length !== 123) {
  throw new Error(`Expected 123 total articles, received ${allArticles.length}.`);
}
if (publishedNow.length === 0 || scheduled.length === 0) {
  throw new Error(`Expected both published and scheduled groups; got published=${publishedNow.length}, scheduled=${scheduled.length}.`);
}

for (const article of scheduled) {
  if (getBlogArticleBySlug(article.slug) !== undefined) {
    throw new Error(`Scheduled article ${article.slug} is incorrectly available without includeScheduled.`);
  }
}

for (const article of publishedNow) {
  if (!getBlogArticleBySlug(article.slug)) {
    throw new Error(`Published article ${article.slug} is missing from detail lookup.`);
  }
}

console.log(JSON.stringify({
  totalArticles: allArticles.length,
  publishedArticles: publishedNow.length,
  scheduledArticles: scheduled.length,
  firstScheduledAt: scheduled[0]?.published_at ?? null,
}, null, 2));
