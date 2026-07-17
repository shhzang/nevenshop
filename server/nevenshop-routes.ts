import { Router, Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { getDb } from './db';
import {
  getProducts,
  getProductBySlug,
  getPages,
  getPageBySlug,
  getTranslations,
  getMenus,
  getDesignTokens,
} from './data-store';

const router = Router();

// ─── Products ────────────────────────────────────────────────────────────────

router.get('/products', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || '';
  res.json(getProducts(lang));
});

router.get('/products/:slug', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || '';
  const product = getProductBySlug(req.params.slug, lang);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// ─── Pages ───────────────────────────────────────────────────────────────────

router.get('/pages', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || '';
  res.json(getPages(lang));
});

router.get('/pages/:slug', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || '';
  const page = getPageBySlug(req.params.slug, lang);
  if (!page) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  res.json(page);
});

// ─── Translations ─────────────────────────────────────────────────────────────

router.get('/translations/:lang', (req: Request, res: Response) => {
  const dict = getTranslations(req.params.lang);
  res.json(dict);
});

// ─── Menus ────────────────────────────────────────────────────────────────────

router.get('/menus', (_req: Request, res: Response) => {
  res.json(getMenus());
});

// ─── Design Tokens ────────────────────────────────────────────────────────────

router.get('/design-tokens', (_req: Request, res: Response) => {
  res.json(getDesignTokens());
});

// ─── Contact / Inquiry ────────────────────────────────────────────────────────

const submissionTracker = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;
  const times = (submissionTracker.get(ip) || []).filter((t) => now - t < windowMs);
  if (times.length >= maxRequests) return true;
  times.push(now);
  submissionTracker.set(ip, times);
  return false;
}

router.post('/contact', async (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    return;
  }
  try {
    const { name, email, phone, message, product } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    const db = await getDb();
    if (db) {
      await db.execute(
        sql`INSERT INTO contact_inquiries (name, email, phone, message, product) VALUES (${name}, ${email}, ${phone || null}, ${message}, ${product || null})`
      );
    }
    console.log(`[Contact] New inquiry from ${email} — ${product || 'general'}`);
    res.json({ success: true, message: 'Thank you for your inquiry. We will get back to you soon.' });
  } catch (err) {
    console.error('[Contact] Error:', err);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
  }
});

// ─── Sitemap ──────────────────────────────────────────────────────────────────

router.get('/sitemap.xml', (_req: Request, res: Response) => {
  const langs = ['en', 'de', 'ar'];
  const products = getProducts();
  const pages = getPages();
  
  // Support multiple domain names
  const host = _req.get('host') || 'neven.bar';
  const protocol = _req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;

  const urls: string[] = [];
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  for (const lang of langs) {
    // Homepage
    urls.push(`<url><loc>${baseUrl}/${lang}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`);
    
    // Products listing page
    urls.push(`<url><loc>${baseUrl}/${lang}/products</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
    
    // Individual products
    for (const p of products) {
      urls.push(`<url><loc>${baseUrl}/${lang}/products/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    }
    
    // Static pages
    for (const pg of pages) {
      urls.push(`<url><loc>${baseUrl}/${lang}/page/${pg.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

export default router;
