---
name: profile-page-ui-redesign
overview: 对个人资料页面进行全面UI/UX优化，实现符合项目科技主题的前卫设计风格，整合玻璃拟态效果、动态交互动画和现代化布局
design:
  architecture:
    framework: react
  styleKeywords:
    - Cyberpunk Neon UI
    - Glassmorphism
    - Tech Theme
    - Dynamic Gradients
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 28px
      weight: 600
    subheading:
      size: 20px
      weight: 500
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#0ea5e9"
      - "#059669"
      - "#2563eb"
    background:
      - "#ffffff"
      - "#000000"
      - rgba(255,255,255,0.7)
      - rgba(10,10,10,0.7)
    text:
      - "#0a0a0a"
      - "#f8fafc"
      - "#4a5568"
    functional:
      - "#22c55e"
      - "#ef4444"
      - "#f59e0b"
todos:
  - id: design-profile-page
    content: Use [skill:ui-ux-pro-max] 设计个人资料页面的详细UI布局和交互方案
    status: completed
    dependencies:
      - create-profile-components
  - id: create-profile-components
    content: 创建ProfileHeader、EditModeForm、SocialLinksCard和AvatarUploader组件
    status: completed
  - id: update-profile-page
    content: 重构profile/page.tsx主页面，整合新组件和布局
    status: completed
    dependencies:
      - create-profile-components
  - id: enhance-existing-components
    content: 增强UserStats、SkillCloud、ActivityTimeline和BadgeCollection组件的动画效果
    status: completed
    dependencies:
      - update-profile-page
  - id: add-theme-support
    content: 为所有组件添加主题感知的CSS类和颜色变量
    status: completed
    dependencies:
      - update-profile-page
  - id: implement-animations
    content: 添加页面加载、悬停、点击等交互动画效果
    status: completed
    dependencies:
      - enhance-existing-components
  - id: test-responsive
    content: 测试响应式布局和主题切换功能
    status: completed
    dependencies:
      - implement-animations
---

## 产品概述

对个人资料页面进行全面UI/UX优化，实现符合项目科技主题的前卫设计风格，整合玻璃拟态效果、动态交互动画和现代化布局。

## 核心功能

- 重新设计的个人资料头部区域，采用玻璃拟态效果和动态渐变背景
- 流畅的查看/编辑模式切换，带动画过渡效果
- 头像上传区域增加悬浮特效和发光边框
- 社交媒体链接采用卡片式展示，带悬停动画
- 数据概览卡片增加动态图表和趋势指示
- 活动时间线增加脉冲动画和渐变连接线
- 成就徽章增加3D翻转效果和解锁动画
- 技能云标签增加悬浮放大和发光效果
- 支持浅色/深色主题平滑切换
- 响应式布局，适配移动端和桌面端

## 技术栈

- 前端框架：React + TypeScript
- 样式方案：Tailwind CSS + CSS变量
- 组件库：自定义GlassCard组件 + Lucide图标

## 系统架构

### 组件架构

```mermaid
graph TB
    A[ProfilePage] --> B[ProfileHeader]
    A --> C[UserStats]
    A --> D[SkillCloud]
    A --> E[ActivityTimeline]
    A --> F[BadgeCollection]
    A --> G[EditModeForm]
    
    B --> B1[AvatarUploader]
    B --> B2[UserInfoDisplay]
    B --> B3[SocialLinksCard]
    
    GlassCard --> [所有组件]
```

### 模块划分

**ProfileHeader模块**

- 职责：展示用户头像、基本信息和社交链接
- 关键技术：玻璃拟态、渐变动画、悬浮效果
- 依赖：GlassCard组件

**EditModeForm模块**

- 职责：处理用户资料编辑
- 关键技术：表单验证、平滑过渡
- 依赖：Input、Textarea、Label组件

**UserStats模块**

- 职责：展示用户统计数据和活动趋势
- 关键技术：动态图表、动画进度条
- 依赖：GlassCard组件

**SkillCloud模块**

- 职责：展示技能标签和熟练度
- 关键技术：分类筛选、悬停动画
- 依赖：GlassCard组件

**ActivityTimeline模块**

- 职责：展示用户活动历史
- 关键技术：时间线动画、脉冲效果
- 依赖：GlassCard组件

**BadgeCollection模块**

- 职责：展示成就徽章
- 关键技术：3D翻转、解锁动画
- 依赖：GlassCard组件

### 数据流

用户交互 → 状态更新 → 组件重渲染 → 动画过渡

## 实现细节

### 核心目录结构

对于现有项目的个人资料页面UI重新设计，显示新增和修改的文件：

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── profile/
│   │   │       ├── page.tsx                    # 修改：主页面重设计
│   │   │       └── components/
│   │   │           ├── ProfileHeader.tsx      # 新增：头部组件
│   │   │           ├── EditModeForm.tsx        # 新增：编辑表单组件
│   │   │           ├── SocialLinksCard.tsx     # 新增：社交链接卡片
│   │   │           └── AvatarUploader.tsx      # 新增：头像上传组件
│   │   └── components/
│   │       ├── profile/
│   │       │   ├── UserStats.tsx              # 修改：增强动画效果
│   │       │   ├── SkillCloud.tsx             # 修改：增加悬浮效果
│   │       │   ├── ActivityTimeline.tsx       # 修改：增加脉冲动画
│   │       │   └── BadgeCollection.tsx        # 修改：增加3D翻转
│   │       └── ui/
│   │           └── GlassCard.tsx               # 保持不变：复用现有组件
```

### 关键代码结构

**ProfileHeader组件**：重新设计的头部区域，包含渐变背景、玻璃拟态效果和动态动画。

```typescript
interface ProfileHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isEditing,
  onEditToggle
}) => {
  // 渐变背景 + 玻璃拟态 + 动态动画
}
```

**EditModeForm组件**：编辑模式表单，支持平滑过渡和实时预览。

```typescript
interface EditModeFormProps {
  formData: Partial<UserProfile>;
  onChange: (data: Partial<UserProfile>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditModeForm: React.FC<EditModeFormProps> = ({...}) => {
  // 表单验证 + 动画过渡
}
```

### 技术实现方案

#### 问题1：头部区域缺少科技感

- **解决方案**：添加动态渐变背景、玻璃拟态效果和悬浮发光边框
- **关键实现**：使用CSS变量tech-cyan、GlassCard组件的glowEffect属性、CSS动画
- **实现步骤**：

1. 创建ProfileHeader组件
2. 使用gradient-bg类添加渐变背景
3. 添加hover发光效果
4. 使用动画类实现平滑过渡

#### 问题2：编辑/查看模式切换不够流畅

- **解决方案**：使用React Transition Group或CSS过渡动画
- **关键实现**：opacity和transform过渡动画
- **实现步骤**：

1. 创建EditModeForm组件
2. 添加CSS过渡类
3. 实现平滑切换逻辑

#### 问题3：缺少动态交互动画

- **解决方案**：为各个组件添加悬停、点击、加载等动画效果
- **关键实现**：Tailwind的group-hover、transition-all、duration-300等类
- **实现步骤**：

1. 更新UserStats组件，添加图表动画
2. 更新SkillCloud组件，添加标签悬停放大
3. 更新ActivityTimeline组件，添加脉冲效果
4. 更新BadgeCollection组件，添加3D翻转

### 集成点

- **状态管理**：使用React useState和useEffect管理组件状态
- **数据格式**：UserProfile接口定义（已存在）
- **主题切换**：使用theme-context实现主题感知
- **动画系统**：使用CSS变量和Tailwind动画类

## 技术考虑

### 日志

- 继续使用现有console.error模式
- 添加性能监控日志（动画渲染时间）

### 性能优化

- 使用React.memo优化组件渲染
- 懒加载动画和图表
- CSS will-change优化动画性能
- 使用transform代替left/top实现动画

### 安全措施

- 头像上传文件类型验证
- 社交链接URL验证（已实现validateSocialLink）
- XSS防护（React内置）

### 可扩展性

- 组件化设计，便于未来扩展
- 支持添加新的社交平台
- 统一的动画系统，易于维护

## 设计风格

采用赛博朋克霓虹UI风格与玻璃拟态（Glassmorphism）相结合的现代科技主题设计。通过动态渐变背景、发光效果、微动画和高对比度配色，营造前卫且富有科技感的视觉体验。

## 页面规划

### 个人资料页面（Profile Page）

**顶部导航块**

- 采用GlassCard组件，带glowEffect发光效果
- 科技主题渐变背景（浅色：蓝白渐变，深色：绿黑渐变）
- 悬浮时边框发光和轻微上浮动画
- 高度：120px

**个人资料头部块**

- 左侧：圆形头像，带脉冲光环动画
- 默认状态：边框渐变，hover时发光并轻微放大
- 编辑模式：相机图标按钮悬浮在右下角，带旋转动画
- 右侧：用户信息区域
- 用户名：渐变文字，3D阴影效果
- 昵称：带icon的行内显示
- 邮箱：半透明效果
- 编辑/保存按钮：科技风格，带发光hover效果

**社交链接卡片块**

- 采用网格布局（2x2或1x4响应式）
- 每个社交平台一个玻璃卡片
- 图标：带彩色渐变和悬浮动画
- 悬停时：卡片上浮、边框发光、图标旋转

**数据概览块**

- 四个统计卡片，采用GlassCard + hoverEffect
- 每个卡片：图标 + 标签 + 数值 + 趋势指示
- 数值：渐变色，带数字滚动动画
- 活动趋势图表：动态增长的柱状图，带渐变填充

**技能云块**

- 技能分类标签：胶囊形状，渐变背景
- 技能条：玻璃卡片内的进度条
- 图标 + 名称 + 熟练度百分比
- 悬停时：进度条高亮、发光
- 底部统计：4个数据点，圆形数字显示

**活动时间线块**

- 左侧：时间线连接线（渐变色）
- 每个活动：圆形图标 + 时间 + 标题 + 描述
- 图标：脉冲动画，最新活动高亮
- 悬停时：卡片发光、图标放大

**成就徽章块**

- 分类标签：与技能云相同风格
- 徽章网格：3D翻转卡片效果
- 正面：图标 + 名称
- 背面：描述 + 进度条（未解锁时）
- 未解锁徽章：半透明 + 锁图标 + 进度百分比
- 底部进度条：解锁总进度，带发光效果

**编辑模式表单块**

- 玻璃卡片容器，带发光边框
- 表单字段：label带icon，半透明背景
- 输入框：悬浮时边框发光
- 保存/取消按钮：科技风格，带loading动画

## 视觉效果

**颜色系统**：使用CSS变量tech-*系列颜色，支持主题切换

**动画效果**：

- 页面加载：fade-in-up动画
- 悬浮：scale-105 + 边框发光
- 模式切换：opacity + transform过渡
- 脉冲：animate-pulse
- 数字滚动：counter动画
- 3D翻转：rotate-y-180

**玻璃拟态**：

- 背景模糊：backdrop-blur-xl
- 半透明：rgba颜色
- 边框：半透明边框 + 发光效果

## Agent Extensions

### Skill

- **ui-ux-pro-max**
- Purpose: 获取现代化的UI/UX设计方案和最佳实践
- Expected outcome: 为个人资料页面提供前卫的科技主题设计建议，包括布局、颜色、动画和交互模式