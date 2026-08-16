import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getHomepageSEO, injectSEOMetadata } from "../ssr-helper";
import { getBlogArticleBySlug, injectBlogArticleSEO, injectBlogListingSEO } from "../blog-seo";

async function injectRouteSEO(html: string, originalUrl: string, protocol: string, host: string): Promise<string> {
  const pathname = originalUrl.split("?")[0].replace(/\/$/, "") || "/";
  const baseUrl = `${protocol}://${host}`;
  const blogArticleMatch = pathname.match(/^\/(en|de|ar)\/blog\/([^/]+)$/);
  const blogListingMatch = pathname.match(/^\/(en|de|ar)\/blog$/);

  if (blogArticleMatch) {
    const [, lang, slug] = blogArticleMatch;
    const article = getBlogArticleBySlug(slug);
    return article ? injectBlogArticleSEO(html, article, lang, baseUrl) : html;
  }

  if (blogListingMatch) {
    return injectBlogListingSEO(html, blogListingMatch[1], baseUrl);
  }

  if (pathname === "/" || pathname === "/en" || pathname === "/de" || pathname === "/ar") {
    return injectSEOMetadata(html, await getHomepageSEO(), baseUrl);
  }

  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      
      template = await injectRouteSEO(
        template,
        url,
        req.protocol || "https",
        req.get("host") || "neven.bar"
      );
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export async function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = await fs.promises.readFile(indexPath, "utf-8");
    
    html = await injectRouteSEO(
      html,
      _req.originalUrl,
      _req.protocol || "https",
      _req.get("host") || "neven.bar"
    );
    
    res.set({ "Content-Type": "text/html" }).send(html);
  });
}
