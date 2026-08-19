# NevenShopper Migration TODO

- [x] 上传279张图片资源到Manus存储，生成路径映射表
- [x] 替换JSON数据文件中的图片路径（products/pages/media-map）
- [x] 复制处理好的JSON数据文件到server/data/
- [x] 创建数据库schema（contact_inquiries表）
- [x] 迁移服务端data-store.ts（JSON数据加载与翻译逻辑）
- [x] 迁移服务端REST API路由（products/pages/translations/menus/contact/sitemap）
- [x] 迁移前端CSS样式（tokens.css + global.css）
- [x] 迁移前端类型定义（types/index.ts）
- [x] 迁移i18n工具函数（lib/i18n.ts）
- [x] 迁移自定义hooks（useTranslations/useProductData）
- [x] 迁移UI组件（Breadcrumbs/Button/ImageCarousel）
- [x] 迁移布局组件（Header/Footer/Layout）
- [x] 迁移页面组件（ContentBlockRenderer/ProductCard/ProductGrid/ProductInquiry）
- [x] 迁移页面（HomePage/ProductsPage/ProductDetailPage/StaticPage/NotFoundPage）
- [x] 更新App.tsx路由结构（多语言/:lang/前缀）
- [x] 更新main.tsx入口
- [x] 编写并通过vitest测试（7/7通过）
- [x] 保存checkpoint并发布

## 管理员后台功能

- [x] 创建后端 tRPC 路由（获取询盘列表、搜索、筛选、导出）
- [x] 创建 AdminInquiriesPage 前端页面（表格显示询盘）
- [x] 实现搜索和筛选功能（邮箱、产品、日期范围）
- [x] 实现 CSV 导出功能
- [x] 添加管理员权限验证（仅 owner 可访问）
- [x] 在 App.tsx 中添加 /admin/inquiries 路由
- [x] 测试管理员后台功能（7/7 通过）
- [x] 保存 checkpoint


## Bug 修复

- [x] 修复产品图片点击无反应（修复 fixUrl 准确解析产品链接）
- [x] 修复首页 Banner 轮播尺寸过大（缩小到 70%）


## GitHub 同步（手机适配更新）

- [x] 从 GitHub 克隆用户的本地版本代码
- [x] 比较代码变更（特别是手机适配部分）
- [x] 应用所有改动到 WebDev 项目（10 个文件）
- [x] 验证所有功能正常（测试 7/7 通过）
- [x] 验证手机适配效果（375x812 视口）
- [x] 保存 checkpoint 并部署

## SEO 优化（首页）

- [x] 添加关键词 meta 标签
- [x] 添加页面描述 meta 标签（50-160 字符）
- [x] 添加 H1 标题到首页
- [x] 为 35 张缺失 alt 文本的图片添加描述
- [x] 验证 SEO 改进
- [x] 保存 checkpoint

## 联系方式与社交链接统一

- [x] 全站统一电话号码为 +1 (425) 520-729
- [x] 全站统一邮箱为 neven6000@gmail.com
- [x] 统一 Facebook 主页链接
- [x] 统一 Instagram 主页链接
- [x] 统一 YouTube 主页链接
- [x] 核对 Facebook、Twitter/X、LinkedIn 动态分享链接
- [x] 编译并逐页验证联系方式
- [x] 保存 checkpoint

<!-- 本次用户指定的统一配置：电话 +1 (425) 520-729；邮箱 neven6000@gmail.com；Facebook https://www.facebook.com/lakeisha.newman.2025；Instagram https://www.instagram.com/nevenshopper/；YouTube https://www.youtube.com/@nevenshopper；Facebook 分享 https://www.facebook.com/sharer/sharer.php?u=页面URL；Twitter/X 分享 https://twitter.com/intent/tweet?url=页面URL&text=文章标题；LinkedIn 分享 https://www.linkedin.com/sharing/share-offsite/?url=页面URL -->

## JSON-LD 联系方式结构化数据

- [x] 在 Organization JSON-LD 中添加最新电话和邮箱
- [x] 在 ContactPoint JSON-LD 中添加客户服务与销售联系方式
- [x] 在 LocalBusiness JSON-LD 中添加最新电话和邮箱
- [x] 验证英文、德文和阿拉伯文主页输出
- [x] 运行构建、测试和 SEO 校验
- [x] 保存 checkpoint

## 页脚联系方式一键复制

- [x] 实现电话和邮箱的一键复制交互
- [x] 添加复制成功提示动画
- [x] 在页脚集成复制按钮并保留电话/邮箱链接
- [x] 验证桌面端和移动端显示与交互
- [x] 运行构建和测试
- [x] 保存 checkpoint
- [x] 保存 checkpoint

## 2026 趋势关键词 Blog 与收录优化

- [x] 按“研究—撰写—配图—接入—校验”顺序逐篇完成 20 篇文章
- [x] 研究 2026 年电子烟相关上升关键词与可信来源
- [x] 撰写 20 篇原创、自然编辑风格的英文文章并完成德文和阿拉伯文版本
- [x] 为 20 篇文章生成并上传主题配图
- [x] 为文章配置 SEO 元数据、内部链接和 JSON-LD 结构化数据
- [x] 创建可抓取的文章 URL，并将 Blog 和文章 URL 纳入 Sitemap
- [x] 验证多语言页面、结构化数据、构建和测试
- [x] 保存 checkpoint

## Blog 文章显示异常修复

- [x] 核对线上页面、预览环境与 Blog API 的文章数量
- [x] 修复线上 Blog 页面仅显示 3 篇文章的原因
- [x] 验证英文、德文和阿拉伯文 Blog 列表均显示完整文章
- [x] 保存 checkpoint

## Google 收录基础优化

- [x] 审查线上 robots、Sitemap、canonical、状态码与可抓取内容
- [x] 核对 Blog、产品、静态页与多语言 URL 是否进入 Sitemap
- [x] 实施无需 Search Console 权限的高优先级技术优化
- [x] 输出 Google Search Console 提交与索引请求清单
- [x] 验证本地收录入口、规范域名与 Sitemap XML
- [x] 保存包含收录优化改动的 checkpoint
- [x] 发布后核验线上 robots、Sitemap、canonical 与可抓取 HTML

## 100 篇 2026 趋势 Blog 扩展

- [x] 按“研究、撰写、翻译、配图、SEO、核验”顺序逐篇完成 100 篇文章
- [x] 研究 2026 年电子烟趋势关键词集群与可信英文来源
- [x] 建立 100 个主题的关键词、搜索意图、来源与内部链接计划
- [x] 逐篇撰写 100 篇原创英文文章并完成德文、阿拉伯文版本
- [x] 为 100 篇文章生成、上传并检查主题配图
- [x] 为全部文章接入 SEO 元数据、JSON-LD、独立 URL 与 Sitemap
- [x] 逐篇验证文章质量、关键词布局、图片、抓取入口与多语言字段
- [x] 运行构建、测试和线上验收
- [x] 保存 checkpoint

## 100 篇内容库与每周十篇开放

- [x] 设计使用发布日期控制 Blog 可见性的发布规则
- [x] 将首批十篇的发布日期写入内容库
- [x] 为后续待创建文章逐篇写入每周十篇的发布日期
- [x] 让列表、详情、SSR、JSON-LD 与 Sitemap 只输出到期文章
- [x] 验证首批十篇可见及后续批次按日期自动开放
- [x] 保存 checkpoint

## 100 篇内容库最终验收

- [x] 验证发布日期过滤使列表、详情、SSR、JSON-LD 与 Sitemap 只输出到期文章
- [x] 验证最终 Blog 列表、文章详情、SEO 和 Sitemap 抓取入口
- [x] 保存 100 篇内容库与发布规则的最终 checkpoint

## 100 篇内容库端到端验收

- [x] 验证已发布文章与预定文章在 Blog 列表和详情页的可见性差异
- [x] 验证已发布文章的 SSR、JSON-LD、canonical 和 Sitemap 条目
- [x] 验证预定文章不出现在 Sitemap 且返回非公开详情页
- [x] 保存最终 checkpoint

## Google 收录停滞诊断与优化

- [x] 审查线上 robots、Sitemap、canonical、状态码和可抓取正文
- [x] 检查重复页面、发布时间、文章内容与内部链接信号
- [x] 实施高优先级收录与页面质量优化
- [x] 输出 Google Search Console 的具体排查与提交步骤
- [x] 验证改进并保存 checkpoint
