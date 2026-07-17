import * as fs from 'fs';
import * as path from 'path';

interface BlogArticle {
  id: number;
  slug: string;
  date: string;
  featured_image?: string;
  seo?: {
    [key: string]: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  translations: {
    [key: string]: {
      title: string;
      excerpt: string;
      content: string;
    };
  };
}

export function generateBlogArticleSchema(article: BlogArticle, lang: string, baseUrl: string) {
  const translation = article.translations[lang] || article.translations['en'];
  const seoData = article.seo?.[lang] || article.seo?.['en'];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seoData?.title || translation.title,
    description: seoData?.description || translation.excerpt,
    image: article.featured_image || `${baseUrl}/logo.png`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'NEVEN',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NEVEN',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.slug}`,
    },
    articleBody: translation.content,
    keywords: seoData?.keywords || '',
  };
}

export function generateBlogListingSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog',
    description: 'Latest articles about vaping, health, safety, and NEVEN products',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'NEVEN',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

export function generateBreadcrumbSchema(article: BlogArticle, lang: string, baseUrl: string) {
  const translation = article.translations[lang] || article.translations['en'];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: translation.title,
        item: `${baseUrl}/blog/${article.slug}`,
      },
    ],
  };
}

export function generateFAQSchema(article: BlogArticle, lang: string) {
  const translation = article.translations[lang] || article.translations['en'];
  
  // Extract questions from content (simple heuristic: lines ending with ?)
  const lines = translation.content.split('\n');
  const faqs = lines
    .filter(line => line.trim().endsWith('?'))
    .slice(0, 5) // Limit to 5 FAQs
    .map((question, index) => ({
      '@type': 'Question',
      name: question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: lines[index + 1]?.trim() || 'See article for more details.',
      },
    }));

  if (faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  };
}
