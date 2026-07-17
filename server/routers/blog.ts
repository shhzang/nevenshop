import { publicProcedure, router } from '../_core/trpc';
import * as fs from 'fs';
import * as path from 'path';

// Load blog data
function loadBlogData() {
  const blogPath = path.join(process.cwd(), 'server', 'data', 'blog.json');
  try {
    const data = fs.readFileSync(blogPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load blog data:', error);
    return [];
  }
}

export const blogRouter = router({
  list: publicProcedure.query(() => {
    return loadBlogData();
  }),

  getBySlug: publicProcedure.query(({ input }: any) => {
    const blogs = loadBlogData();
    return blogs.find((blog: any) => blog.slug === input?.slug);
  }),
});
