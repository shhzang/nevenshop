import fs from "node:fs";
import path from "node:path";
import {
  generateBlogArticleSchema,
  generateBlogListingSchema,
  generateBreadcrumbSchema,
} from "./blog-structured-data";

export interface BlogArticle {
  id: number;
  slug: string;
  date: string;
  published_at?: string;
  featured_image?: string;
  seo?: Record<string, { title: string; description: string; keywords: string }>;
  translations: Record<string, { title: string; excerpt: string; content: string }>;
}

const listingCopy = {
  en: { title: "Blog | NEVEN — Adult Product, Safety & Compliance Insights", description: "Explore adult-focused NEVEN articles on product information, battery care, recycling, travel preparation and responsible retail compliance.", h1: "NEVEN Blog: Product, Safety and Compliance Insights" },
  de: { title: "Blog | NEVEN — Produkt-, Sicherheits- und Compliance-Einblicke", description: "Entdecken Sie erwachsenenorientierte NEVEN-Artikel zu Produktinformationen, Akkupflege, Recycling, Reiseplanung und verantwortungsvoller Compliance.", h1: "NEVEN Blog: Produkt-, Sicherheits- und Compliance-Einblicke" },
  ar: { title: "المدونة | NEVEN — رؤى المنتج والسلامة والامتثال", description: "اكتشف مقالات NEVEN الموجهة للبالغين حول معلومات المنتج والعناية بالبطارية وإعادة التدوير وتخطيط السفر والامتثال المسؤول.", h1: "مدونة NEVEN: رؤى المنتج والسلامة والامتثال" },
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function absoluteUrl(baseUrl: string, url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
}

function scriptTag(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function metaTag(name: string, content: string): string {
  return `<meta name="${name}" content="${escapeHtml(content)}">`;
}

export function isBlogArticlePublished(article: Pick<BlogArticle, "published_at">, now = new Date()): boolean {
  if (!article.published_at) return true;
  const publishAt = new Date(`${article.published_at}T00:00:00Z`);
  return !Number.isNaN(publishAt.valueOf()) && publishAt <= now;
}

export function getBlogArticles(options: { includeScheduled?: boolean; now?: Date } = {}): BlogArticle[] {
  const blogPath = path.join(process.cwd(), "server", "data", "blog.json");
  const articles = JSON.parse(fs.readFileSync(blogPath, "utf8")) as BlogArticle[];
  if (options.includeScheduled) return articles;
  return articles.filter((article) => isBlogArticlePublished(article, options.now));
}

export function getBlogArticleBySlug(slug: string, options: { includeScheduled?: boolean; now?: Date } = {}): BlogArticle | undefined {
  return getBlogArticles(options).find((article) => article.slug === slug);
}

function injectHead(html: string, headHtml: string, fallbackHtml: string): string {
  const withoutBaseSeo = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name=["'](?:description|keywords)["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:(?:type|title|description|url|image)["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:(?:card|title|description|image)["'][^>]*>\s*/gi, "");
  const withHead = withoutBaseSeo.replace("</head>", `${headHtml}\n</head>`);
  return withHead.replace('<div id="root"></div>', `${fallbackHtml}<div id="root"></div>`);
}

export function injectBlogListingSEO(html: string, lang: string, baseUrl: string): string {
  const copy = listingCopy[lang as keyof typeof listingCopy] ?? listingCopy.en;
  const canonical = `${baseUrl}/${lang}/blog`;
  const articles = getBlogArticles();
  const cards = articles
    .map((article) => {
      const translation = article.translations[lang] ?? article.translations.en;
      const articleUrl = `${baseUrl}/${lang}/blog/${article.slug}`;
      return `<article><h2><a href="${articleUrl}">${escapeHtml(translation.title)}</a></h2><p>${escapeHtml(translation.excerpt)}</p></article>`;
    })
    .join("");
  const head = [
    `<title>${escapeHtml(copy.title)}</title>`,
    metaTag("description", copy.description),
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${escapeHtml(copy.title)}">`,
    `<meta property="og:description" content="${escapeHtml(copy.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    scriptTag(generateBlogListingSchema(baseUrl, lang)),
  ].join("\n");
  const fallback = `<main data-seo-fallback><h1>${escapeHtml(copy.h1)}</h1>${cards}</main>`;
  return injectHead(html, head, fallback);
}

export function injectBlogArticleSEO(html: string, article: BlogArticle, lang: string, baseUrl: string): string {
  const translation = article.translations[lang] ?? article.translations.en;
  const seo = article.seo?.[lang] ?? article.seo?.en;
  const title = seo?.title ?? translation.title;
  const description = seo?.description ?? translation.excerpt;
  const image = absoluteUrl(baseUrl, article.featured_image);
  const canonical = `${baseUrl}/${lang}/blog/${article.slug}`;
  const alternateLinks = ["en", "de", "ar"]
    .map((locale) => `<link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/blog/${article.slug}">`)
    .join("\n");
  const articleHtml = translation.content
    .split("\n\n")
    .filter(Boolean)
    .map((paragraph) => {
      const heading = paragraph.replace(/^#{1,3}\s+/, "");
      const isHeading = heading.length < 70 && !/[.!؟。]$/.test(heading);
      return isHeading ? `<h2>${escapeHtml(heading)}</h2>` : `<p>${escapeHtml(paragraph)}</p>`;
    })
    .join("");
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    metaTag("description", description),
    metaTag("keywords", seo?.keywords ?? ""),
    `<link rel="canonical" href="${canonical}">`,
    alternateLinks,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    image ? `<meta property="og:image" content="${image}">` : "",
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    image ? `<meta name="twitter:image" content="${image}">` : "",
    scriptTag(generateBlogArticleSchema(article, lang, baseUrl)),
    scriptTag(generateBreadcrumbSchema(article, lang, baseUrl)),
  ].filter(Boolean).join("\n");
  const fallback = `<main data-seo-fallback><article><h1>${escapeHtml(translation.title)}</h1>${image ? `<img src="${image}" alt="${escapeHtml(translation.title)}">` : ""}<p>${escapeHtml(translation.excerpt)}</p>${articleHtml}</article></main>`;
  return injectHead(html, head, fallback);
}
