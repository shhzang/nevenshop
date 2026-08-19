# Google 收录恢复行动清单

本次已修复待发布或不存在的 Blog URL 返回应用壳但仍使用 HTTP 200 的问题。待发布文章现在返回 HTTP 404，因此不会被 Google 作为重复或软 404 候选页面处理。

## 发布后立即执行

1. 在 Google Search Console 中重新提交 `https://neven.bar/sitemap.xml`。
2. 使用“网址检查”检查以下四类 URL：`/en`、`/en/blog`、一篇已发布 Blog、一个产品详情页。对前三项请求编入索引即可，不要逐篇提交文章。
3. 在“编入索引 → 网页”报告中记录每个排除原因及 URL 数量，尤其是“已抓取 - 当前未编入索引”“已发现 - 当前未编入索引”“重复网页”和“软 404”。

## 内容策略调整

- 维持每周十篇的上限，勿一次性将后续待发布文章开放给爬虫。
- 对主题高度相似的回收、合规或设备说明文章，保留一个支柱页和少量互补文章；没有独特场景、来源或新答案的内容不应进入 Sitemap。
- 每篇公开文章应保留来源、具体发布日期、编辑日期、作者/编辑说明以及至少一条相关文章链接。
- 不以“通过 AI 检测”作为内容目标；优先证明内容对成人读者、零售流程或产品信息核对具有独立价值。

## 两周后复查

若两周后索引数量仍未增长，请从 Search Console 导出“已抓取 - 当前未编入索引”示例 URL 和“重复网页”示例 URL。根据 Google 显示的具体规范 URL、抓取时间和排除理由再针对性修复，而不是继续增加文章数量。

## 参考

- Google Sitemap 概述：https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google 生成式 AI 内容指导：https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google 垃圾内容政策：https://developers.google.com/search/docs/essentials/spam-policies
