# neven.bar：10 月初流量峰值初步审查

**审查时间：** 2026-10-09  
**范围：** `neven.bar` 的线上埋点配置、关联预览域名、公开流量估算与可访问的技术证据。  
**结论级别：** 初步技术审查；没有访问 Umami 后台的逐日访客、来源或页面明细，不能把“可能原因”表述为已证实的获客增长。

## 结论摘要

1. **已确认的统计污染风险：高。** 在本次修复前，正式站、两个 `manus.space` 地址、Sandbox 预览地址以及本地开发站均加载了**同一个** Umami 网站 ID（`df64182d-3bcb-4259-b06d-8387b3c9a703`）。因此开发、验收、分享预览链接和访问测试会写入与正式站相同的分析属性。
2. 因而，10 月初的曲线爆发**不能直接等同于真实买家或自然搜索流量的爆发**。在没有来源、落地页、国家、设备和逐日访问明细前，最合理的已验证解释是：流量中可能混入了预览/测试访问；但目前不能量化其占比。
3. 公开 Similarweb 数据不足以支持“真实流量爆发”的判断：2026 年 7–9 月 desktop/total/unique 指标返回 `Data not found`；mobile 渠道记录均为 0。它仅说明站点低于 Similarweb 的公开估算阈值，**不等于网站绝对没有真实访问**，也无法覆盖尚未结束的 10 月。
4. 已加入**正式域名限定**：Umami 现在只会在 `neven.bar` 和 `www.neven.bar` 加载；`manus.space`、预览 URL、Sandbox 与本地开发页不会再向正式分析属性写入访问。此修复只能让**后续数据更干净**，不能追溯清洗旧峰值。

## 已验证证据

| 检查项 | 结果 | 对峰值判断的含义 |
|---|---|---|
| `https://neven.bar/` | 加载 `https://manus-analytics.com/umami`，使用网站 ID `df64182d-3bcb-4259-b06d-8387b3c9a703` | 正式站分析脚本存在且可访问 |
| `https://nevenshop.manus.space/` | 同一 Umami URL、同一网站 ID | 预览域名会混入正式属性（修复前） |
| `https://nevenshop-ecdyy3jy.manus.space/` | 同一 Umami URL、同一网站 ID | 第二个托管域名会混入正式属性（修复前） |
| 当前 Sandbox 预览 URL | 同一 Umami URL、同一网站 ID | 验收/测试访问会混入正式属性（修复前） |
| 本地 `localhost:3000` | 同一 Umami URL、同一网站 ID | 开发访问会混入正式属性（修复前） |
| Umami 统计 API | 未授权请求返回 HTTP 401 | 不能通过公开网站 ID 读取访客明细；需后台权限 |
| Similarweb（2026-07 至 2026-09） | total、unique、desktop 返回 `Data not found`；mobile 各渠道为 0 | 公开第三方估算无法证实 10 月初峰值 |

## 对“为什么会爆发”的判断

### 已验证、最需要先排除的原因：预览与测试访问混入

项目在部署与 SEO 验收过程中会打开 `neven.bar`、`manus.space`、Sandbox 预览页、产品页与 Blog 页。修复前上述地址共用一个分析网站 ID，任何访问都可能进入同一张曲线。

这不是对访问量大小的猜测，而是一个已验证的归因边界问题：**目前的历史统计无法自动保证“只包含正式生产流量”。**

### 尚未证实、需在后台核实的原因

| 假设 | 需要看到的后台信号 | 当前是否能证实 |
|---|---|---|
| 真实自然搜索增长 | Referrer 为 Google/Bing；落地页是 Blog/产品页；国家与设备分布自然；峰值后仍有延续 | 否 |
| 社交或外链带来访问 | Referrer 为 Facebook、Instagram、YouTube、其他引荐域名；峰值集中于特定落地页 | 否 |
| 内部预览/验收访问 | URL/hostname 出现 `manus.space`、预览地址或集中在测试时段；来源多为 Direct | 代码配置可证实风险，数量未证实 |
| 非标准爬虫、监控或自动化 | 单一国家/设备/浏览器、极短停留、单页访问、异常直接流量或重复模式 | 否 |

## 关于搜索引擎爬虫

Umami 官方文档说明，默认会将机器人排除在统计之外；只有设置 `DISABLE_BOT_CHECK` 才会关闭这项检查。参考：[Umami 环境变量文档](https://docs.umami.is/docs/environment-variables#disable_bot_check)。

因此，不能在没有证据的情况下把这次峰值直接归因于 Google 抓取。不过 Manus 托管的 Umami 实例是否保持该默认配置不可从公开页面确认；同时，未被识别的自动化访问仍可能存在。

## 已实施修复

### 1. 限制正式分析脚本的加载域名

`client/index.html` 现在只在下列 host 动态加载 Umami：

- `neven.bar`
- `www.neven.bar`

以下环境不会再向正式分析属性发送 pageview：

- `nevenshop.manus.space`
- `nevenshop-ecdyy3jy.manus.space`
- Sandbox 开发预览 URL
- `localhost`

### 2. 增加回归验证

新增 `scripts/validate-analytics-scope.mjs`，检查生产域名白名单、host 判断与动态加载逻辑，防止将来再次改回“所有环境都埋点”。

### 3. 修复随发布日期变化而失效的 Sitemap 验证

发现原 Sitemap 验证脚本把多语言 Blog URL 数量固定为 69。当前已有 103 篇公开文章、20 篇待发布文章，固定数量会产生误报。验证现已按 `published_at` 动态计算应有的 3 语言文章 URL 数。

## 已完成验证

| 验证 | 结果 |
|---|---|
| `node scripts/validate-analytics-scope.mjs` | 通过：只允许 `neven.bar` / `www.neven.bar` 加载 Umami |
| `pnpm run check` | 通过 |
| `pnpm test` | 17/17 通过 |
| `pnpm run build` | 通过 |
| `node scripts/validate-sitemap.mjs` | 通过：309 条多语言 Blog 文章 URL |
| `node --import tsx scripts/validate-release-visibility.mjs` | 通过：123 篇总文章、103 篇公开、20 篇待发布 |

## 需要的最小后台数据

请从 Manus/Umami 分析面板导出或截图 **2026-10-01 至今** 的以下数据。无需提供账号或密码：

1. 总访问、访客、页面浏览量的**按日趋势图**；
2. 峰值当日与前后各 2 天的**来源/Referrer 前 10 名**；
3. **落地页/Pages 前 10 名**；
4. **国家、设备类型、浏览器**分布；
5. 如果界面可显示完整 URL/host，请确认是否出现 `manus.space` 或 Sandbox 预览地址。

拿到这些数据后可用下面的规则快速定性：

- **Google/Bing + Blog/产品页 + 多天持续**：真实自然搜索增长；
- **单一社交/引荐域名 + 单一落地页**：外部传播或投放带来的峰值；
- **Direct 为主 + 预览 host/短时间集中**：测试或预览混入；
- **单国、单设备、极短停留/单页**：自动化或低质量流量，需要再做过滤。

## 局限性

- 本审查无法登录 Manus 分析面板；Sandbox 未登录，而已连接的个人浏览器访问 Manus 控制台时显示地区不可用。
- 没有实际 Umami 明细、Google Search Console 数据或服务器访问日志时，不能可靠地给峰值分配百分比，也不能宣称其来自 Google、客户或机器人。
- 当前修复不会删除或重算历史数据；请从修复发布后至少观察 7 天，再将新曲线与旧峰值分开比较。
