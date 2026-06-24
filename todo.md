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
