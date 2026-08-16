import fs from "node:fs";
import path from "node:path";

const blogPath = path.resolve("server/data/blog.json");
const articles = JSON.parse(fs.readFileSync(blogPath, "utf8"));
const recent = articles.filter((article) => article.id >= 4);
const incomplete = recent.filter(
  (article) =>
    !article.featured_image ||
    !article.seo?.en ||
    !article.seo?.de ||
    !article.seo?.ar ||
    !article.translations?.en?.content ||
    !article.translations?.de?.content ||
    !article.translations?.ar?.content
);

console.log(
  JSON.stringify(
    {
      totalArticles: articles.length,
      newArticles: recent.length,
      newIds: recent.map((article) => article.id),
      missingOrIncomplete: incomplete.map((article) => article.id),
    },
    null,
    2
  )
);

if (recent.length !== 20 || incomplete.length > 0) {
  process.exit(1);
}
