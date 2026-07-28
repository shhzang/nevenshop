# NEVEN 网站转化漏斗分析指南

## 转化漏斗概述

本文档描述了 NEVEN 网站的转化漏斗，用于追踪用户从发现产品到完成联系的整个过程。

## 转化漏斗阶段

### 阶段 1: 产品发现 (Discovery)
**事件名称**: `funnel_discover_product`

用户首次接触产品的阶段。这可能发生在：
- 首页浏览
- 产品列表页面
- 博客文章中的产品提及
- 社交媒体链接

**追踪的数据**:
- `product_id`: 产品 ID
- `product_name`: 产品名称
- `source`: 来源（home、products_page、blog 等）
- `timestamp`: 时间戳

**何时触发**:
```typescript
conversionEvents.discoverProduct(productId, productName, source);
```

---

### 阶段 2: 产品兴趣 (Interest)
**事件名称**: `funnel_product_interest`

用户对产品表现出兴趣的阶段。这包括：
- 点击产品卡片
- 查看产品详情页面
- 阅读产品描述
- 在产品页面停留较长时间

**追踪的数据**:
- `product_id`: 产品 ID
- `product_name`: 产品名称
- `time_spent_seconds`: 在产品页面的停留时间（秒）
- `timestamp`: 时间戳

**何时触发**:
```typescript
// 当用户点击产品时
productEvents.clickProduct(productId, productName, 'products_page');

// 当用户查看产品详情时
productEvents.viewProductDetails(productId, productName);

// 当用户在产品页面停留一段时间后
conversionEvents.showProductInterest(productId, productName, timeSpent);
```

---

### 阶段 3: 联系意图 (Contact Intent)
**事件名称**: `funnel_contact_intent`

用户表现出联系企业意图的阶段。这包括：
- 滚动到联系部分
- 将鼠标悬停在联系按钮上
- 查看邮箱地址

**追踪的数据**:
- `product_id`: 相关产品 ID（可选）
- `source`: 来源（产品页面、首页等）
- `timestamp`: 时间戳

**何时触发**:
```typescript
conversionEvents.showContactIntent(productId, source);
```

---

### 阶段 4: 联系行动 (Contact Action)
**事件名称**: `funnel_contact_action`

用户采取联系行动的阶段。这是最关键的转化指标，包括：
- 点击邮箱链接
- 点击电话号码
- 打开邮件客户端
- 拨打电话

**追踪的数据**:
- `contact_method`: 联系方式（email、phone、whatsapp 等）
- `product_id`: 相关产品 ID（可选）
- `timestamp`: 时间戳

**何时触发**:
```typescript
// 当用户点击邮箱联系按钮时
contactEvents.emailContactClick(source);
conversionEvents.initiateContact('email', productId);

// 当用户点击电话号码时
conversionEvents.initiateContact('phone', productId);
```

---

### 阶段 5: 联系完成 (Contact Complete)
**事件名称**: `funnel_contact_complete`

用户成功完成联系的阶段。这需要手动追踪或集成邮件系统：
- 邮件成功发送
- 电话呼叫完成
- 表单提交成功

**追踪的数据**:
- `contact_method`: 联系方式
- `product_id`: 相关产品 ID（可选）
- `timestamp`: 时间戳

**何时触发**:
```typescript
// 在邮件成功发送后
conversionEvents.completeContact('email', productId);

// 在电话呼叫后
conversionEvents.completeContact('phone', productId);
```

---

## 转化漏斗分析

### 关键指标

1. **发现到兴趣的转化率**
   - 计算: (产品兴趣事件数 / 产品发现事件数) × 100%
   - 目标: > 30%
   - 说明: 有多少比例的用户在发现产品后进一步了解

2. **兴趣到联系意图的转化率**
   - 计算: (联系意图事件数 / 产品兴趣事件数) × 100%
   - 目标: > 15%
   - 说明: 有多少比例的用户在了解产品后考虑联系

3. **联系意图到联系行动的转化率**
   - 计算: (联系行动事件数 / 联系意图事件数) × 100%
   - 目标: > 50%
   - 说明: 有多少比例的用户在有意图后采取行动

4. **整体转化率**
   - 计算: (联系行动事件数 / 产品发现事件数) × 100%
   - 目标: > 2-5%
   - 说明: 从发现到联系的整体转化效率

### 分析维度

#### 按产品分析
- 哪些产品的转化率最高？
- 哪些产品需要优化？
- 产品之间的转化差异原因

#### 按来源分析
- 不同来源（首页、产品页、博客）的转化率对比
- 优化高转化来源
- 改进低转化来源

#### 按时间分析
- 按天、周、月追踪转化率趋势
- 识别季节性模式
- 评估营销活动效果

#### 按用户行为分析
- 用户在每个阶段的停留时间
- 用户的典型转化路径
- 用户流失点分析

---

## 在 Manus Analytics 中查看数据

### 访问分析仪表板
1. 登录 Manus 管理后台
2. 进入 Analytics 或 Dashboard 部分
3. 查看自定义事件数据

### 创建转化漏斗报告
1. 创建新报告
2. 选择事件序列:
   - `funnel_discover_product`
   - `funnel_product_interest`
   - `funnel_contact_intent`
   - `funnel_contact_action`
   - `funnel_contact_complete`
3. 设置时间范围
4. 分析漏斗数据

### 设置警报
- 当转化率下降超过 20% 时发出警报
- 当某个产品的转化率异常低时发出警报
- 当特定来源的流量下降时发出警报

---

## 优化建议

### 提高发现到兴趣的转化率
- 优化产品卡片的视觉设计
- 改进产品标题和描述
- 添加更多产品图片和视频
- 显示用户评价和评分

### 提高兴趣到联系意图的转化率
- 在产品页面添加清晰的联系 CTA
- 突出联系信息
- 添加社交证明（客户评价）
- 减少页面加载时间

### 提高联系意图到联系行动的转化率
- 简化联系流程
- 提供多种联系方式（邮箱、电话、表单）
- 添加浮动联系按钮
- 显示响应时间承诺

### 提高整体转化率
- 定期分析转化漏斗数据
- A/B 测试不同的 CTA 文本
- 优化移动用户体验
- 改进页面加载速度

---

## 集成检查清单

- [x] 产品发现事件已实现
- [x] 产品兴趣事件已实现
- [x] 联系意图事件已实现
- [x] 联系行动事件已实现
- [ ] 联系完成事件需要邮件系统集成
- [ ] Manus Analytics 仪表板配置
- [ ] 转化漏斗报告创建
- [ ] 警报规则设置

---

## 代码示例

### 在产品页面中追踪转化漏斗

```typescript
import { conversionEvents, productEvents } from '@/lib/analytics';
import { useEffect, useState } from 'react';

export function ProductDetailPage() {
  const [timeSpent, setTimeSpent] = useState(0);
  const productId = '123';
  const productName = 'NEVEN Pro 15000';

  useEffect(() => {
    // 记录产品发现
    conversionEvents.discoverProduct(productId, productName, 'product_page');

    // 记录停留时间
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContactClick = () => {
    // 记录联系意图
    conversionEvents.showContactIntent(productId, 'product_page');
    
    // 记录联系行动
    conversionEvents.initiateContact('email', productId);
  };

  useEffect(() => {
    if (timeSpent > 30) {
      // 用户停留超过 30 秒，记录兴趣
      conversionEvents.showProductInterest(productId, productName, timeSpent);
    }
  }, [timeSpent]);

  return (
    <div>
      {/* 产品内容 */}
      <button onClick={handleContactClick}>
        Contact Us
      </button>
    </div>
  );
}
```

---

## 常见问题

**Q: 如何区分不同的联系方式？**
A: 使用 `contact_method` 参数，支持 'email'、'phone'、'whatsapp' 等。

**Q: 如何追踪表单提交？**
A: 在表单提交成功后调用 `contactEvents.contactFormSubmit(formData)`。

**Q: 如何计算转化率？**
A: 使用 Manus Analytics 的漏斗报告功能自动计算，或手动计算：(后续事件数 / 前置事件数) × 100%。

**Q: 多久应该检查一次转化数据？**
A: 建议每周检查一次，以及时发现趋势和问题。
