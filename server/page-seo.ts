/**
 * Page-level SEO metadata optimization
 * Generates dynamic meta tags and structured data for different page types
 */

import { getProducts, getPages, getProductBySlug, getPageBySlug } from './data-store';
import {
  generateProductSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  wrapInScriptTag,
} from './structured-data';

export interface PageSEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  structuredData?: string;
}

/**
 * Get SEO metadata for products listing page
 */
export function getProductsListingSEO(lang: string, baseUrl: string): PageSEOMetadata {
  const products = getProducts(lang);
  const count = products.length;

  const title = lang === 'de' ? 'NEVEN Produkte - Premium Einweg-Vapes' :
                lang === 'ar' ? 'منتجات NEVEN - السجائر الإلكترونية المتاح لاستخدام واحد' :
                'NEVEN Products - Premium Disposable Vapes';

  const description = lang === 'de' ? 'Entdecken Sie unsere Kollektion von NEVEN Premium Einweg-Vapes mit außergewöhnlichem Geschmack und Qualität.' :
                     lang === 'ar' ? 'اكتشف مجموعتنا من السجائر الإلكترونية NEVEN المتاح لاستخدام واحد بنكهة استثنائية وجودة عالية.' :
                     'Explore our collection of NEVEN Premium Disposable Vapes with exceptional flavor and quality.';

  const keywords = lang === 'de' ? 'NEVEN Vapes, Einweg-Vapes, Premium Vaping, Vape Produkte' :
                  lang === 'ar' ? 'NEVEN السجائر الإلكترونية, السجائر الإلكترونية المتاح لاستخدام واحد, السجائر الإلكترونية المتميزة' :
                  'NEVEN vapes, disposable vapes, premium vaping, vape products';

  const url = `${baseUrl}/${lang}/products`;

  // Generate breadcrumb schema
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `${baseUrl}/${lang}` },
      { name: 'Products', url },
    ],
    { baseUrl }
  );

  // Generate collection page schema
  const collection = generateCollectionPageSchema({
    name: title,
    description,
    url,
    itemCount: count,
    baseUrl,
  });

  const structuredData = [
    wrapInScriptTag(breadcrumb),
    wrapInScriptTag(collection),
  ].join('\n');

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    canonical: url,
    structuredData,
  };
}

/**
 * Get SEO metadata for product detail page
 */
export function getProductDetailSEO(slug: string, lang: string, baseUrl: string): PageSEOMetadata | null {
  const product = getProductBySlug(slug, lang);
  if (!product) return null;

  const url = `${baseUrl}/${lang}/products/${slug}`;
  const title = product.title || 'NEVEN Disposable Vape';
  const description = product.short_description || product.description || 'Premium NEVEN disposable vape product';

  // Extract first image if available
  let ogImage = `${baseUrl}/manus-storage/logo-black_f44d892e.png`;
  if (product.content_blocks && product.content_blocks.length > 0) {
    const firstImageBlock = product.content_blocks.find((block: any) => 
      block.type === 'fusion_images' || block.type === 'image'
    );
    if (firstImageBlock && firstImageBlock.images && firstImageBlock.images.length > 0) {
      ogImage = firstImageBlock.images[0];
    }
  }

  // Generate breadcrumb schema
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `${baseUrl}/${lang}` },
      { name: 'Products', url: `${baseUrl}/${lang}/products` },
      { name: title, url },
    ],
    { baseUrl }
  );

  // Generate product schema
  const productSchema = generateProductSchema(
    {
      name: title,
      description,
      image: ogImage,
      url,
      availability: 'https://schema.org/InStock',
    },
    { baseUrl }
  );

  const structuredData = [
    wrapInScriptTag(breadcrumb),
    wrapInScriptTag(productSchema),
  ].join('\n');

  return {
    title,
    description,
    keywords: `${title}, NEVEN vapes, disposable vapes, premium vaping`,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: url,
    canonical: url,
    structuredData,
  };
}

/**
 * Get SEO metadata for static pages
 */
export function getStaticPageSEO(slug: string, lang: string, baseUrl: string): PageSEOMetadata | null {
  const page = getPageBySlug(slug, lang);
  if (!page) return null;

  const url = `${baseUrl}/${lang}/page/${slug}`;
  const title = page.title || 'Page';
  const description = page.description || page.short_description || 'Page content';

  // Generate breadcrumb schema
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `${baseUrl}/${lang}` },
      { name: title, url },
    ],
    { baseUrl }
  );

  // Generate webpage schema
  const webPage = generateWebPageSchema(
    {
      title,
      description,
      url,
      image: `${baseUrl}/manus-storage/logo-black_f44d892e.png`,
    },
    { baseUrl }
  );

  const structuredData = [
    wrapInScriptTag(breadcrumb),
    wrapInScriptTag(webPage),
  ].join('\n');

  return {
    title,
    description,
    keywords: `${title}, NEVEN, vapes`,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    canonical: url,
    structuredData,
  };
}

/**
 * Generate meta tags HTML from SEO metadata
 */
export function generateMetaTags(seo: PageSEOMetadata): string {
  const tags: string[] = [];

  // Basic meta tags
  tags.push(`<title>${escapeHtml(seo.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(seo.description)}" />`);

  if (seo.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`);
  }

  // Open Graph tags
  if (seo.ogTitle) {
    tags.push(`<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`);
  }
  if (seo.ogDescription) {
    tags.push(`<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`);
  }
  if (seo.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`);
  }
  if (seo.ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(seo.ogUrl)}" />`);
  }

  // Canonical tag
  if (seo.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);
  }

  // Structured data
  if (seo.structuredData) {
    tags.push(seo.structuredData);
  }

  return tags.join('\n');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
