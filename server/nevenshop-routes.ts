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
import { getBlogArticles } from './blog-seo';
import { generateSitemapXml } from './sitemap';

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
  res.type('application/xml').send(generateSitemapXml());
});

export default router;
