## 联系我（Contact）页面设计与实现计划

### 设计理念
基于 **Glassmorphism 毛玻璃风格** 与 **Mac OS 设计原则**，与现有首页、游戏馆、音乐馆保持风格统一。

*   **视觉风格**：通透的毛玻璃背景、圆角卡片、细腻阴影、流畅动画
*   **布局结构**：Hero 区域 + 热门分类 + FAQ 手风琴 + 联系 CTA
*   **交互体验**：悬停缩放、平滑过渡、输入框聚焦动画
*   **字体**：使用 Inter 字体，中文清晰易读

### 核心功能模块

1.  **Hero Section**
    *   标题："联系我"（Contact Me）
    *   搜索栏：快速查找常见问题
    *   副标题："很高兴与你交流"

2.  **热门分类 (Popular Categories)**
    *   常见联系主题卡片：技术咨询、商务合作、反馈建议、其他
    *   每个卡片包含：图标、标题、描述、箭头

3.  **FAQ 手风琴**
    *   可展开/折叠的问答列表
    *   每个问题：问题标题、答案、图标指示器

4.  **联系 CTA (Contact CTA）**
    *   主要联系方式：邮箱、社交媒体链接
    *   备选联系：支持表单或即时通讯

### 技术实现步骤

#### 第一阶段：基础结构与类型定义
1.  创建 `frontend/src/components/contact/HeroSection.tsx` - Hero 区域组件
2.  创建 `frontend/src/components/contact/ContactCard.tsx` - 联系方式卡片
3.  创建 `frontend/src/components/contact/FAQAccordion.tsx` - FAQ 手风琴组件
4.  创建 `frontend/src/app/contact/page.tsx` - 主页面组装

#### 第二阶段：样式与动画
5.  应用 Glassmorphism 毛玻璃效果（`backdrop-blur`，半透明背景）
6.  添加 Framer Motion 动画（卡片入场、展开/折叠过渡）
7.  实现响应式布局（移动端适配）

### 预期效果
用户进入 `/contact` 页面后，将看到一个现代化、专业的联系界面，可以快速找到常见问题、浏览热门主题、并通过多种方式与博主取得联系。
