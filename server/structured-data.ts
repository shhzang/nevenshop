/**
 * Structured Data (JSON-LD) generators for SEO
 * Generates Schema.org compliant JSON-LD for various page types
 */

export interface StructuredDataOptions {
  baseUrl: string;
  lang?: string;
}

/**
 * Generate Organization schema for homepage
 */
export function generateOrganizationSchema(options: StructuredDataOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NevenShopper',
    url: options.baseUrl,
    logo: `${options.baseUrl}/manus-storage/logo-black_f44d892e.png`,
    description: 'Premium NEVEN disposable vapes with exceptional flavor and quality',
    sameAs: [
      'https://www.facebook.com/lakeisha.newman.2025',
      'https://www.instagram.com/nevenshop',
      'https://www.tiktok.com/@nevenshop',
      'https://www.youtube.com/@nevenshop',
      'https://www.linkedin.com/company/nevenshop',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'neven6000@gmail.com',
      url: `${options.baseUrl}/contact`,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressLocality: 'Shenzhen',
      addressRegion: 'Guangdong',
      streetAddress: 'Shenzhen, China',
    },
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>, options: StructuredDataOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Product schema for product pages
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image?: string;
  url: string;
  price?: string;
  currency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
}, options: StructuredDataOptions) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: product.url,
  };

  if (product.image) {
    schema.image = product.image;
  }

  if (product.price && product.currency) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability || 'https://schema.org/InStock',
      url: product.url,
    };
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate WebPage schema for static pages
 */
export function generateWebPageSchema(page: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}, options: StructuredDataOptions) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
  };

  if (page.image) {
    schema.image = page.image;
  }

  if (page.datePublished) {
    schema.datePublished = page.datePublished;
  }

  if (page.dateModified) {
    schema.dateModified = page.dateModified;
  }

  return schema;
}

/**
 * Generate LocalBusiness schema (if applicable)
 */
export function generateLocalBusinessSchema(options: StructuredDataOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'NevenShopper',
    image: `${options.baseUrl}/manus-storage/logo-black_f44d892e.png`,
    description: 'Premium NEVEN disposable vapes manufacturer and distributor',
    url: options.baseUrl,
    telephone: '+86-755-XXXXXXXX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shenzhen, China',
      addressLocality: 'Shenzhen',
      addressRegion: 'Guangdong',
      postalCode: '518000',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.5431',
      longitude: '114.0579',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

/**
 * Generate FAQ schema for FAQ pages
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate CollectionPage schema for product listing pages
 */
export function generateCollectionPageSchema(options: {
  name: string;
  description: string;
  url: string;
  itemCount: number;
  baseUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: options.name,
    description: options.description,
    url: options.url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: options.itemCount,
      url: options.url,
    },
  };
}

/**
 * Wrap structured data in script tag
 */
export function wrapInScriptTag(data: any): string {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}
