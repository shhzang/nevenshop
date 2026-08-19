# Google 收录停滞审查（2026-08-19）

## 线上抓取基础

- `robots.txt` 允许抓取，并声明 `https://neven.bar/sitemap.xml`。
- 线上 Sitemap 可访问；当前含 189 个页面 URL，并列出公开英文 Blog 文章。
- 英文 Blog 列表含 33 个标准文章锚链接、一个 H1 和 33 个 H2；因此已发布文章具备基本内部发现路径。
- 已抽查的公开文章提供服务端正文、H1、canonical、描述和 JSON-LD。

## 主要收录风险

1. 网站在短时间内增加了大量主题相近的三语内容；Google 明确指出，大量自动生成且没有足够新增价值的页面可能构成规模化内容滥用风险。
2. 多语言文章会扩大 URL 数量，但不应仅以翻译或关键词变化作为独立收录理由；需要清晰的语言目标、不同市场背景和实质编辑价值。
3. Sitemap 能辅助发现页面，但不能保证收录。Google 建议同时依靠清晰的内部链接，并通过 Search Console 的 URL 检查和页面索引报告定位具体排除原因。
4. 当前公开 Blog 包含若干日期接近、主题相似的合规/回收文章；应优先合并重复意图，保留更强的支柱页面和少量互补专题，避免稀释站点主题权威。

## 官方来源

- Google Sitemap 概述：https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google 生成式 AI 内容指导：https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google 垃圾内容政策：https://developers.google.com/search/docs/essentials/spam-policies
- Google Search Console：https://search.google.com/search-console/about
