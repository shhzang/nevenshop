# Google 收录优化研究依据

审查日期：2026-08-16

## 线上发现

- `https://neven.bar/robots.txt` 允许抓取并声明根 Sitemap。
- 发布前的线上 Sitemap 使用了内部代理域名，且因未转义的 `&` 报 XML 解析错误；代码已改为固定 `https://neven.bar` 并进行 XML 转义，待发布后生效。
- Blog 的 20 篇新文章已具备独立 URL、H1、文章级 JSON-LD 与可抓取正文回退；产品及静态页还需同样的服务端 canonical 注入。

## Google 官方依据

1. Google 建议 Sitemap 使用绝对 URL、包含希望出现在搜索结果中的 canonical URL，并要求 XML 中的值正确进行实体转义；Sitemap 提交是发现提示，不保证立即收录。
   - https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
2. `rel="canonical"`、Sitemap 与重定向可叠加传递 preferred canonical 信号；canonical 应为 HTML `<head>` 中的绝对 URL。
   - https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
3. 对于大量新 URL，Google 建议提交 Sitemap；对少量关键 URL，可用 Search Console 的 URL Inspection 请求重新抓取，通常需要数天到数周。
   - https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
4. JavaScript 网站最好在初始 HTML 中提供重要内容与 canonical；Google 可渲染 JavaScript，但渲染会排队，服务端或预渲染可改善抓取与速度。
   - https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
