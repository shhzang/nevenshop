import { describe, expect, it } from 'vitest';
import { getHomepageSEO, injectSEOMetadata } from './ssr-helper';
import { getStaticPageSEO, injectPageSEO } from './page-seo';
import { escapeXml, PRIMARY_SITE_URL } from './seo-config';

const template = '<html><head><title>Default</title><meta name="description" content="Default"><link rel="canonical" href="https://neven.bar/"></head><body><div id="root"></div></body></html>';

describe('indexing SEO safeguards', () => {
  it('keeps the public domain stable and XML-safe', () => {
    expect(PRIMARY_SITE_URL).toBe('https://neven.bar');
    expect(escapeXml('Health & Safety')).toBe('Health &amp; Safety');
    expect(escapeXml("NEVEN's <guide>")).toBe('NEVEN&apos;s &lt;guide&gt;');
  });

  it('injects language-specific canonical and hreflang signals for homepages', async () => {
    const seo = await getHomepageSEO('de');
    const html = injectSEOMetadata(template, seo, PRIMARY_SITE_URL, 'de');

    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html).toContain('rel="canonical" href="https://neven.bar/de"');
    expect(html).toContain('hreflang="en" href="https://neven.bar/en"');
    expect(html).toContain('hreflang="ar" href="https://neven.bar/ar"');
  });

  it('gives static pages their own canonical rather than the homepage canonical', () => {
    const seo = getStaticPageSEO('about-us', 'en', PRIMARY_SITE_URL);
    expect(seo).not.toBeNull();

    const html = injectPageSEO(template, seo!, seo!.title);
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).toContain('href="https://neven.bar/en/page/about-us"');
    expect(html).toContain('<h1>About Us</h1>');
  });
});
