# neven.bar：90 天流量、抓取与 Blog 收录审计

仪表盘的 90 天数据说明，站点的抓取和内容发现已经有了明显进展，但现阶段的“流量增长”不能直接解读为真实买家增长。最重要的证据是浏览器维度中的 **searchbot 192 次访问**，占 868 次访问的 **22.1%**。而 10 月初的峰值与 10 月 5 日、10 月 12 日两批 Blog 文章公开的时间相邻。

这与“Google 已收录 40 多页”的观察是一致的：Google 及其他检索系统更频繁地发现、抓取了新增文章和 sitemap URL。它是收录恢复的积极信号，但尚不足以证明这些文章已带来稳定的真实用户、订单或自然搜索点击。

## 截图中可以确认的数据

| 指标 | 最近 90 天数值 | 判断 |
|---|---:|---|
| 页面浏览量 | 2,244 | 有增长，但包含爬虫、预览/测试历史数据及人类访问 |
| 访问量 | 868 | 不能直接等同于独立真实客户 |
| 访客 | 437 | 尚未按机器人过滤重算 |
| 平均停留时长 | 6 分 39 秒 | 汇总指标，不能单独证明内容质量或交易意图 |
| 跳出率 | 46% | 在未剔除自动化流量前不宜作为内容删除依据 |
| searchbot 访问量 | 192 | 占总访问 22.1%，表明抓取是当前流量曲线的重要组成 |
| 美国访客 | 369 / 437 | 占可见访客 84.4%，美国是当前最明确的主要市场信号 |
| Chrome 访问量 | 201 | 最大的人类浏览器类别；iOS 仅 22，移动端样本仍有限 |

截图列出的高浏览页面每页均为 5 次浏览，且语言分布混合：英文 2 条、德文 3 条、阿拉伯文 5 条，加上阿拉伯文 Blog 列表页 1 条。它们都是与年龄政策、可充电特性、存放温度、回收、零售政策、废弃物记录及飞行政策相关的合规/安全主题。

这个页面小样本**不能**证明阿拉伯文整体表现最好，也不能证明某篇文章具有高商业价值；它只能证明三种语言都被发现和抓取，且合规、安全与处置主题值得保留并进一步验证。

## 为什么 10 月初出现峰值

项目数据中的公开节奏为：9 月 28 日发布 10 篇，10 月 5 日发布 10 篇，10 月 12 日发布 10 篇。仪表盘从 10 月初开始出现连续的大峰值，因此最合理的解释是：新增 URL 进入 sitemap、站内链接和多语言路由后，搜索爬虫开始集中发现与抓取。

截图无法证明 Google 是唯一来源，也无法确认每次 searchbot 都来自 Googlebot。因此结论应表述为：**10 月初主要是内容发现/抓取加速，混合少量真实访问；不是已经证实的自然搜索客户爆发。**

Google 的 Page Indexing 报告也说明，已收录 URL 的数量应该随站点重要页面增长而逐步上升；它同时强调无需期待 100% URL 被收录，重点是 canonical 的重要页面。[3]

## 当前收录为什么能增长

站点已具备四项对发现与收录有帮助的基础条件：

1. `robots.txt` 允许搜索引擎抓取并声明 `https://neven.bar/sitemap.xml`；
2. sitemap 当前可发现 429 个规范 URL，其中 339 个是三语 Blog URL；
3. 英文、德文与阿拉伯文页面均有独立 canonical、hreflang、标题、描述和文章级结构化数据；
4. 不存在或未到发布日期的 Blog URL 返回真实 HTTP 404，避免把 SPA 应用壳错误当作文章页抓取。

高浏览页面的主题还显示出清晰的内容方向：成年用户政策、年龄验证、设备保存、航空旅行、回收与零售合规。这些主题对应用户能直接完成的任务，优于泛泛的“趋势”“口味”“大烟雾”类泛关键词。

## 关键词与内容机会

在美国受众占主导、且内容站属于电子烟/尼古丁相关高敏感主题的前提下，优先做**事实可验证、面向成年用户、地区可限定**的关键词集：

- 年龄与访问控制：`vape age verification requirements`、`adult vape retail policy`、`ENDS access restrictions`；
- 安全储存：`vape battery storage temperature`、`lithium battery vape storage`、`vape travel battery rules`；
- 合规处置：`how to dispose of e-cigarettes safely`、`vape recycling collection point`、`lithium battery vape disposal`；
- 零售操作：`vape retailer compliance checklist`、`ENDS product documentation`、`vape waste record keeping`；
- 地区化监管解释：以“某地区 + 当前规则 + 生效日期 + 官方来源”为页面结构，而不是重复编造国家或城市落地页。

这些主题与 2026 年的公开监管和安全变化相符：FDA 2026 年关于特定 ENDS 市场准入的公告强调年龄/身份核验与面向 21 岁以上成年人的营销限制；美国 EPA 说明电子烟含尼古丁和锂电池，不应投入家庭垃圾或普通回收；英国 2025 年起禁止销售/供应不可充电、不可补充的一次性 vape，其影响仍使回收与可重复使用设计成为持续话题。[4] [5] [6]

这不是“哪些词搜索量最高”的结论。Google Trends 数据接口没有向当前环境返回可用结果，且 Search Console 没有数据，因此不能捏造搜索量、排名或语言胜负。

## 不应现在删除的文章

目前**不应仅凭零访问或 5 次浏览删除任何 Blog**。原因有三点：

- 站点正处于抓取和初步收录阶段，新文章尚未经历足够的搜索展示周期；
- 现有分析混有至少 22.1% 的 searchbot 访问，历史页面数据不能直接作为人类兴趣排名；
- 每个文章 slug 有 EN / DE / AR 三个版本，删除应先判断其 canonical、索引状态、主题重叠和对用户的实际帮助，而不是仅按访问量。

应优先审查并可能合并/重写的候选是：篇幅低于该语言内容中位数、缺少可点击的一手来源、与另一篇覆盖同一问题且没有新增场景、没有内部链接、或标题只是在替换同义词的文章。已被截图展示的合规与安全文章应保留并增强，不是删除优先项。

## 已实施的统计清洗

此前已限定 Umami 仅在 `neven.bar` 与 `www.neven.bar` 加载，预览、`manus.space` 和本地开发环境不再污染正式流量。本次进一步加入客户端已知爬虫 user-agent 排除；例如 `searchbot` 不再加载 Umami 脚本。该做法不能追溯重算过去 90 天数据，但会让发布后的比较更接近人类访问。

## Blog 页面下一步优化

当前列表页一次展示全部公开文章。应先升级为内容库，而不是继续无限增加卡片：

1. 增加 4–6 个固定的主题入口，例如 Safety & Storage、Recycling & Disposal、Adult Retail Compliance、Travel & Local Rules；
2. 为每个主题建立一篇经过来源核对的支柱页，并从相关文章以明确锚文本链接；
3. 列表使用分页或“加载更多”，默认突出近期审核文章、热门合规主题和地区化指南；
4. 在文章页显示适用地区、审核日期、作者/审核者和可点击的官方来源；
5. 仅在 Search Console 已显示实际展示与查询后，选择 10–20 篇有展示但点击低的页面重写 title、description 与首屏摘要。

## 关于 200 篇与发布时间

不建议把 200 篇新文章压缩在三天内，或通过随机日期制造“人工发布”印象。Google 的垃圾内容政策将“主要为了操纵排名而批量产生、对用户没有价值的页面”定义为 scaled content abuse；Google 也明确提示，伪造作者、为了显得新鲜而改日期、或主要为了搜索排名批量添加内容都不是以用户为先的做法。[1] [2]

更安全的方案是：先从现有 113 篇公开文章中完成一轮质量审查；然后在每次有真实一手来源、明确适用地区、独特读者任务和编辑审核记录时发布少量专题内容。文章日期必须是真实发布日期，不能用于伪装。

## 收集下一轮决策数据

在统计清洗发布后观察至少 14 天，然后截图以下指标：

- 排除 `searchbot` 后的页面、来源、国家和设备；
- 每个语言目录的访问、页面浏览与来源；
- Search Console 的页面级展示/点击/查询及 Page Indexing 原因。

这些数据才能决定英语、德语、阿拉伯语哪个应成为后续重点，以及哪些文章应该合并、重写、noindex 或删除。

## References

[1]: https://developers.google.com/search/docs/essentials/spam-policies "Google Search spam policies: scaled content abuse"
[2]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content "Google guidance for helpful, reliable, people-first content"
[3]: https://support.google.com/webmasters/answer/7440203?hl=en "Google Search Console Page indexing report"
[4]: https://www.fda.gov/news-events/press-announcements/fda-expands-market-access-authorizes-new-ends-products "FDA announcement on ENDS authorizations and device access restrictions"
[5]: https://www.epa.gov/hw/how-safely-dispose-e-cigarettes-information-individuals "EPA guidance for safe e-cigarette disposal"
[6]: https://defraenvironment.blog.gov.uk/2025/05/01/single-use-vapes-why-its-time-to-ditch-them-for-good/ "UK government explanation of the single-use vape ban"
