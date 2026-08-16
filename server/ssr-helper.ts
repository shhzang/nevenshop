import { getPageBySlug } from './data-store';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateLocalBusinessSchema,
  wrapInScriptTag,
} from './structured-data';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  h1Title: string;
  ogImage?: string;
}

const homepageCopy: Record<string, SEOMetadata> = {
  en: {
    title: 'NevenShopper — Premium Disposable Vapes',
    description: 'Discover premium NEVEN disposable vapes with exceptional flavor and quality. Browse our collection of high-quality vaping products.',
    keywords: 'disposable vapes, NEVEN vapes, premium vaping, vape products, e-cigarettes, vaping devices',
    h1Title: 'Premium NEVEN Disposable Vapes - High Quality Vaping Products',
  },
  de: {
    title: 'NevenShopper — Premium Einweg-Vapes',
    description: 'Entdecken Sie hochwertige NEVEN Einweg-Vapes mit klaren Produktinformationen, innovativen Funktionen und sorgfältiger Verarbeitung.',
    keywords: 'NEVEN Vapes, Einweg-Vapes, Vape Produkte, Premium Vaping, E-Zigaretten',
    h1Title: 'Premium NEVEN Einweg-Vapes und Vape-Produkte',
  },
  ar: {
    title: 'NevenShopper — أجهزة NEVEN الإلكترونية المتميزة',
    description: 'اكتشف أجهزة NEVEN الإلكترونية المتميزة مع معلومات واضحة عن المنتجات وميزات مبتكرة وجودة تصنيع دقيقة.',
    keywords: 'NEVEN، السجائر الإلكترونية، أجهزة فيب، منتجات فيب مميزة',
    h1Title: 'أجهزة NEVEN الإلكترونية ومنتجات الفيب المتميزة',
  },
};

/**
 * 获取首页 SEO 元数据
 */
export async function getHomepageSEO(lang = 'en'): Promise<SEOMetadata> {
  return homepageCopy[lang] || homepageCopy.en;
}

/**
 * 生成首页的 JSON-LD 结构化数据
 */
export function generateHomepageStructuredData(baseUrl: string): string {
  // Organization schema
  const orgSchema = generateOrganizationSchema({ baseUrl });
  
  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: baseUrl },
    ],
    { baseUrl }
  );
  
  // WebPage schema
  const webPageSchema = generateWebPageSchema(
    {
      title: 'NevenShopper — Premium Disposable Vapes',
      description: 'Discover premium NEVEN disposable vapes with exceptional flavor and quality. Browse our collection of high-quality vaping products.',
      url: baseUrl,
      image: `${baseUrl}/manus-storage/logo-black_f44d892e.png`,
    },
    { baseUrl }
  );
  
  // Combine all schemas
  const schemas = [
    wrapInScriptTag(orgSchema),
    wrapInScriptTag(breadcrumbSchema),
    wrapInScriptTag(webPageSchema),
  ];
  
  return schemas.join('\n');
}

/**
 * 注入 SEO 元数据到 HTML 模板
 */
export function injectSEOMetadata(html: string, seo: SEOMetadata, baseUrl?: string, lang = 'en'): string {
  // 注入 H1 标题到 root div 之前（作为隐藏的 SEO 元素）
  const h1Html = `<h1 style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;">${escapeHtml(seo.h1Title)}</h1>`;
  
  // 生成图片 SEO HTML
  const imageHtml = generateImageSEOHtml();
  
  // 生成 JSON-LD 结构化数据
  const structuredData = baseUrl ? generateHomepageStructuredData(baseUrl) : '';
  const canonical = baseUrl ? `${baseUrl}/${lang}` : '';
  const alternateLinks = baseUrl
    ? ['en', 'de', 'ar'].map((locale) => `<link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}">`).join('\n')
    : '';
  const withoutBaseSeo = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name=["'](?:description|keywords)["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  const headSeo = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="keywords" content="${escapeHtml(seo.keywords)}">`,
    canonical ? `<link rel="canonical" href="${canonical}">` : '',
    alternateLinks,
  ].filter(Boolean).join('\n');
  
  // 替换 root div 的位置
  const modifiedHtml = withoutBaseSeo.replace(
    '</head>',
    `${headSeo}\n</head>`
  ).replace(
    '<div id="root"></div>',
    `${h1Html}${imageHtml}${structuredData}<div id="root"></div>`
  );

  return modifiedHtml;
}

/**
 * 为首页生成 SEO 友好的图片 HTML（用于 SSR）
 */
export function generateImageSEOHtml(): string {
  // 首页的 35 张图片及其 alt 文本
  const images = [
    // Banner 轮播（11 张）
    { alt: 'NEVEN Premium Disposable Vape Banner 1', src: '/manus-storage/banner-5_e75a6cd1.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 2', src: '/manus-storage/banner-6_8ccd3a1e.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 3', src: '/manus-storage/banner-7_99828e82.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 4', src: '/manus-storage/banner-8-1_266bc11a.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 5', src: '/manus-storage/banner-9_ace6bac5.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 6', src: '/manus-storage/banner-10-1_d5ea1042.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 7', src: '/manus-storage/banner-11_3796b41e.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 8', src: '/manus-storage/banner-1-1-scaled_c4e0a9fa.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 9', src: '/manus-storage/banner-2_94a7e3aa.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 10', src: '/manus-storage/banner-3_1a91d6b0.jpg' },
    { alt: 'NEVEN Premium Disposable Vape Banner 11', src: '/manus-storage/banner-4-1_acf5d7d7.jpg' },
  ];

  // 生成隐藏的图片 HTML（用于 SEO）
  const imageHtml = images
    .map(img => `<img src="${img.src}" alt="${escapeHtml(img.alt)}" style="display:none;" />`)
    .join('');

  return imageHtml;
}

/**
 * 转义 HTML 特殊字符
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
