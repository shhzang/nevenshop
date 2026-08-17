import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { getBlogArticleBySlug, getBlogArticles } from '../blog-seo';

export const blogRouter = router({
  list: publicProcedure.query(() => {
    return getBlogArticles();
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => {
    return getBlogArticleBySlug(input.slug) ?? null;
  }),
});
