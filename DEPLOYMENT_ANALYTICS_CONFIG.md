# Manus Analytics 部署环境配置指南

## 概述

本文档说明如何在生产环境中正确配置 Manus Analytics，确保自定义事件追踪正常工作。

## 环境变量配置

### 必需的环境变量

在部署环境中，以下环境变量必须正确设置：

#### 1. `VITE_ANALYTICS_ENDPOINT`
- **说明**: Manus Analytics 服务的端点 URL
- **示例**: `https://analytics.manus.im`
- **位置**: 自动由 Manus 平台注入
- **验证**: 在浏览器控制台中检查 Umami 脚本是否加载

#### 2. `VITE_ANALYTICS_WEBSITE_ID`
- **说明**: 网站在 Manus Analytics 中的唯一 ID
- **示例**: `550e8400-e29b-41d4-a716-446655440000`
- **位置**: 自动由 Manus 平台注入
- **验证**: 在 HTML 源代码中检查 `data-website-id` 属性

### 环境变量注入方式

Manus 平台自动处理环境变量注入：

1. **开发环境** (`NODE_ENV=development`)
   - 环境变量从 `.env` 文件读取
   - 实时热重载支持
   - 可在浏览器控制台调试

2. **生产环境** (`NODE_ENV=production`)
   - 环境变量在构建时注入到 HTML 中
   - 使用 `%VITE_ANALYTICS_ENDPOINT%` 和 `%VITE_ANALYTICS_WEBSITE_ID%` 占位符
   - 在 `client/index.html` 中替换

## 验证配置

### 步骤 1: 检查 HTML 源代码

1. 打开网站
2. 右键 → "查看页面源代码"
3. 搜索 "umami"
4. 应该看到类似的代码：

```html
<script
  defer
  src="https://analytics.manus.im/umami"
  data-website-id="550e8400-e29b-41d4-a716-446655440000"></script>
```

**如果看到占位符** (如 `%VITE_ANALYTICS_ENDPOINT%`):
- ❌ 环境变量未正确注入
- 需要检查构建过程

### 步骤 2: 检查浏览器控制台

1. 打开浏览器开发者工具 (F12)
2. 进入 "Console" 标签
3. 输入以下命令检查 Umami 是否加载：

```javascript
// 检查 umami 对象是否存在
console.log(window.umami);

// 应该输出类似的对象：
// {track: ƒ, identify: ƒ, ...}
```

**如果返回 `undefined`**:
- ❌ Umami 脚本未加载
- 检查网络标签中是否有加载错误

### 步骤 3: 检查网络请求

1. 打开浏览器开发者工具的 "Network" 标签
2. 刷新页面
3. 搜索 "umami"
4. 应该看到 Umami 脚本的加载请求

**检查项**:
- ✅ 状态码应该是 200
- ✅ 脚本大小应该 > 0 KB
- ✅ 加载时间应该 < 1 秒

### 步骤 4: 测试事件追踪

1. 在浏览器控制台输入以下命令：

```javascript
// 测试追踪事件
window.umami.track('test_event', {
  test_property: 'test_value',
  timestamp: new Date().toISOString()
});

console.log('Event tracked successfully');
```

2. 进入 Manus Analytics 仪表板
3. 应该在 "Events" 或 "Custom Events" 中看到 `test_event`

## 常见问题排查

### 问题 1: Umami 脚本加载失败

**症状**: 
- 浏览器控制台显示 404 错误
- `window.umami` 为 `undefined`

**解决方案**:
1. 检查 `VITE_ANALYTICS_ENDPOINT` 是否正确
2. 确认 Manus Analytics 服务可访问
3. 检查网络连接和防火墙设置

### 问题 2: 事件未在仪表板中显示

**症状**:
- 事件被追踪但不显示在 Analytics 中
- 自定义事件列表为空

**解决方案**:
1. 确认 `VITE_ANALYTICS_WEBSITE_ID` 正确
2. 检查事件名称是否符合命名规范
3. 等待 5-10 分钟让数据同步
4. 清除浏览器缓存并重新加载

### 问题 3: 环境变量未注入

**症状**:
- HTML 中仍然显示 `%VITE_ANALYTICS_ENDPOINT%`
- 脚本 src 为空或无效

**解决方案**:
1. 检查构建过程是否正确
2. 确认 `vite.config.ts` 中的环境变量配置
3. 重新构建项目：`pnpm build`
4. 清除构建缓存：`rm -rf dist`

## Manus 平台配置

### 在 Manus 管理后台配置

1. **登录 Manus 管理后台**
   - 访问 https://manus.im
   - 进入项目设置

2. **配置 Analytics**
   - 进入 "Settings" → "Analytics"
   - 确认 Analytics 已启用
   - 记录 Website ID

3. **检查环境变量**
   - 进入 "Settings" → "Environment Variables"
   - 验证 `VITE_ANALYTICS_ENDPOINT` 和 `VITE_ANALYTICS_WEBSITE_ID` 已设置
   - 如果缺失，手动添加或联系 Manus 支持

### 部署后验证

部署后立即执行以下检查：

1. **访问已部署的网站**
   - 打开生产 URL
   - 检查 HTML 源代码中的 Umami 脚本

2. **执行用户操作**
   - 点击产品
   - 点击邮箱联系
   - 分享到社交媒体

3. **查看 Analytics 仪表板**
   - 进入 Manus Analytics
   - 检查事件是否被记录
   - 验证转化漏斗数据

## 性能考虑

### Umami 脚本加载性能

- **脚本大小**: ~10-15 KB (gzip)
- **加载时间**: 通常 < 500ms
- **对页面性能的影响**: 最小 (< 1%)

### 事件追踪性能

- **事件发送方式**: 异步，不阻塞用户交互
- **批量发送**: 事件会被批量发送以减少网络请求
- **对用户体验的影响**: 无

## 安全考虑

### 数据隐私

- ✅ Umami 不使用 Cookie 追踪用户
- ✅ 事件数据不包含个人信息
- ✅ 符合 GDPR 和隐私法规

### 数据传输

- ✅ 使用 HTTPS 加密传输
- ✅ 事件数据不包含敏感信息
- ✅ Manus 平台负责数据安全

## 监控和告警

### 建议的监控指标

1. **事件追踪成功率**
   - 监控事件是否正常被记录
   - 设置告警阈值：< 95%

2. **转化漏斗完成率**
   - 监控用户从发现到联系的转化
   - 设置告警阈值：< 2%

3. **页面加载时间**
   - 监控 Umami 脚本对页面性能的影响
   - 设置告警阈值：> 3 秒

### 设置告警

在 Manus Analytics 中：
1. 进入 "Alerts" 或 "Notifications"
2. 创建新告警规则
3. 设置条件和通知方式

## 故障排除清单

- [ ] 验证 `VITE_ANALYTICS_ENDPOINT` 正确
- [ ] 验证 `VITE_ANALYTICS_WEBSITE_ID` 正确
- [ ] 检查 HTML 源代码中的 Umami 脚本
- [ ] 检查浏览器控制台中的 `window.umami` 对象
- [ ] 测试事件追踪功能
- [ ] 在 Analytics 仪表板中验证事件
- [ ] 检查网络请求是否成功
- [ ] 验证转化漏斗数据
- [ ] 检查页面加载性能
- [ ] 设置监控和告警

## 联系支持

如果遇到问题，请：

1. **检查此文档**中的常见问题部分
2. **查看 Manus 文档**: https://docs.manus.im
3. **联系 Manus 支持**: support@manus.im

## 相关文档

- [CONVERSION_FUNNEL_GUIDE.md](./CONVERSION_FUNNEL_GUIDE.md) - 转化漏斗分析指南
- [client/src/lib/analytics.ts](./client/src/lib/analytics.ts) - 事件追踪代码
- Manus 官方文档: https://docs.manus.im/analytics
