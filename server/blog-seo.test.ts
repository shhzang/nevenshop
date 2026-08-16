import { describe, expect, it } from "vitest";
import {
  getBlogArticleBySlug,
  getBlogArticles,
  injectBlogArticleSEO,
  injectBlogListingSEO,
} from "./blog-seo";

const template = "<html><head><title>Base title</title><meta name=\"description\" content=\"Base description\"></head><body><div id=\"root\"></div></body></html>";

describe("2026 Blog content and SEO", () => {
  it("keeps 20 newly added articles complete in English, German and Arabic", () => {
    const additions = getBlogArticles().filter((article) => article.id >= 4);

    expect(additions).toHaveLength(20);
    additions.forEach((article) => {
      expect(article.featured_image).toMatch(/^\/manus-storage\//);
      expect(article.seo?.en.description.length).toBeGreaterThan(50);
      expect(article.translations.en.content.length).toBeGreaterThan(400);
      expect(article.translations.de.content.length).toBeGreaterThan(400);
      expect(article.translations.ar.content.length).toBeGreaterThan(400);
    });
  });

  it("injects one canonical article title, description, crawlable H1 and JSON-LD", () => {
    const article = getBlogArticleBySlug("travelling-with-a-vape-2026-guide");
    expect(article).toBeDefined();

    const html = injectBlogArticleSEO(template, article!, "en", "https://www.neven.bar");
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html).toContain('rel="canonical" href="https://www.neven.bar/en/blog/travelling-with-a-vape-2026-guide"');
    expect(html).toContain("<h1>Travelling With a Vape in 2026: A Responsible Planning Guide</h1>");
    expect(html.match(/application\/ld\+json/g)).toHaveLength(2);
  });

  it("injects a language-specific Blog collection page with article links", () => {
    const html = injectBlogListingSEO(template, "de", "https://www.neven.bar");
    expect(html).toContain('href="https://www.neven.bar/de/blog"');
    expect(html).toContain("/de/blog/travelling-with-a-vape-2026-guide");
    expect(html).toContain("<h1>NEVEN Blog: Produkt-, Sicherheits- und Compliance-Einblicke</h1>");
  });
});
