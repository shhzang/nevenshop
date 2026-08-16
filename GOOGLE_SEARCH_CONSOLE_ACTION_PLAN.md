# neven.bar Google 收录行动清单

本次技术更新会在发布后提供稳定的 `https://neven.bar` canonical URL、可解析的根 Sitemap、三语 Blog URL、产品页与静态页的服务端 SEO 元数据。请在发布后按以下顺序操作。

| 优先级 | 操作 | 位置或 URL | 完成标准 |
|---|---|---|---|
| P0 | 提交 Sitemap | `https://neven.bar/sitemap.xml` | Search Console 的 Sitemaps 报告显示成功读取，且没有 XML 解析错误。 |
| P0 | 检查首批关键 URL | `/en`、`/en/products`、`/en/blog`、一篇 2026 Blog、一个产品详情页 | URL Inspection 显示可抓取，canonical 为 `https://neven.bar/...`。 |
| P1 | 对少量核心 URL 请求编入索引 | 主页、Blog 列表、1–3 篇最重要的新文章 | 仅对优先 URL 使用“Request indexing”；不要对所有文章重复提交。 |
| P1 | 查看 Page indexing 报告 | Search Console → Indexing → Pages | 重点排查“Crawled - currently not indexed”“Duplicate, Google chose different canonical”“Blocked by robots.txt”。 |
| P2 | 每周查看一次表现 | Search Console → Performance | 跟踪已展示的 Blog URL、查询词与点击；根据有展示但低点击的页面优化标题和描述。 |

## 关键核对项

1. 请使用 **Domain property** 或同时验证 `https://neven.bar/` 与 `https://www.neven.bar/`，并将 `https://neven.bar` 作为首选规范域名。
2. Sitemap 中应只出现 `https://neven.bar/...` URL，不应包含内部预览域名或代理域名。
3. 新内容从提交到抓取、渲染和收录通常需要时间。Google 说明：对少量 URL 可以用 URL Inspection 请求重新抓取；对于大量新 URL，提交 Sitemap 是推荐的发现方式。
4. 若页面显示“已抓取但尚未编入索引”，不要反复请求同一 URL；优先检查内容独特性、页面自引用 canonical、站内链接与对应语言页面是否可访问。

## Google 官方参考

- Sitemap：<https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Canonical：<https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- 请求重新抓取：<https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl>
- JavaScript SEO：<https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
