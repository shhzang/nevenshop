import { getProducts, getPages } from './data-store';
import { getBlogArticles } from './blog-seo';
import { escapeXml, PRIMARY_SITE_URL } from './seo-config';

const LANGUAGES = ['en', 'de', 'ar'] as const;

export function generateSitemapXml(baseUrl = PRIMARY_SITE_URL): string {
  const products = getProducts();
  const pages = getPages();
  const blogArticles = getBlogArticles();
  const urls: string[] = [];

  for (const lang of LANGUAGES) {
    urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}`)}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`);
    urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}/products`)}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`);

    for (const product of products) {
      urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}/products/${product.slug}`)}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    }
    for (const page of pages) {
      urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}/page/${page.slug}`)}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
    }

    urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}/blog`)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
    for (const article of blogArticles) {
      const imageUrl = article.featured_image?.startsWith('http')
        ? article.featured_image
        : article.featured_image
          ? `${baseUrl}${article.featured_image}`
          : '';
      const imageXml = imageUrl
        ? `<image:image><image:loc>${escapeXml(imageUrl)}</image:loc><image:title>${escapeXml(article.translations[lang]?.title || article.translations.en.title)}</image:title></image:image>`
        : '';
      const lastmod = article.date ? `<lastmod>${escapeXml(article.date)}</lastmod>` : '';
      urls.push(`<url><loc>${escapeXml(`${baseUrl}/${lang}/blog/${article.slug}`)}</loc>${lastmod}<changefreq>monthly</changefreq><priority>0.7</priority>${imageXml}</url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;
}
