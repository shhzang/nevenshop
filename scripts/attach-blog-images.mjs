import fs from 'node:fs';
import path from 'node:path';

const mapPath = process.argv[2];
if (!mapPath) {
  throw new Error('Usage: node scripts/attach-blog-images.mjs <image-map.json>');
}

const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
for (const [id, featuredImage] of Object.entries(imageMap)) {
  if (!/^\/manus-storage\/.+\.png$/.test(featuredImage)) {
    throw new Error(`Invalid managed image path for article ${id}`);
  }

  const articlePath = path.resolve(`research/new-article-${String(id).padStart(3, '0')}.json`);
  const article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
  if (article.featured_image) {
    throw new Error(`Article ${id} already has an image; refusing to overwrite.`);
  }
  article.featured_image = featuredImage;
  fs.writeFileSync(articlePath, `${JSON.stringify(article, null, 2)}\n`);
  console.log(`Attached image to article ${id}: ${article.slug}`);
}
