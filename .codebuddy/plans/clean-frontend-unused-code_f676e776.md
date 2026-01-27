---
name: clean-frontend-unused-code
overview: 清理前端项目中的重复组件、未使用的文件和冗余代码。具体包括：删除 components/profile/ 下8个重复组件（保留 app/profile/components/ 版本）、删除 home 目录下2个未使用组件、删除 search 目录、删除未使用的 tabs UI 组件、清理 PostCard 中未使用的 ClockIcon 导入
todos:
  - id: delete-profile-components
    content: 删除 components/profile/ 目录下的8个重复组件
    status: completed
  - id: delete-home-components
    content: 删除 home 目录下的 ProfilePanel 和 Sidebar 未使用组件
    status: completed
  - id: delete-search-dir
    content: 删除 search 目录及其内容
    status: completed
  - id: delete-tabs-component
    content: 删除 ui 目录下的 tabs 组件
    status: completed
  - id: clean-postcard-import
    content: 清理 PostCard.tsx 中未使用的 ClockIcon 导入
    status: completed
  - id: verify-build
    content: 验证项目编译无错误
    status: completed
    dependencies:
      - delete-profile-components
      - delete-home-components
      - delete-search-dir
      - delete-tabs-component
      - clean-postcard-import
---

## 产品概述

清理前端项目中的重复组件、未使用的文件和冗余代码，提高项目代码质量和可维护性。

## 核心功能

- 删除 components/profile/ 下的8个重复组件（保留 app/profile/components/ 版本）
- 删除 home 目录下的 ProfilePanel 和 Sidebar 未使用组件
- 删除 search 目录及其 SearchBar 组件
- 删除未使用的 tabs UI 组件
- 清理 PostCard.tsx 中未使用的 ClockIcon 导入

## 技术栈

- 前端框架：Next.js + TypeScript
- 项目结构：基于 Next.js 13+ App Router

## 技术架构

### 清理范围分析

这是一个现有项目的代码清理任务，需要删除以下文件：

1. **重复组件清理**：删除 components/profile/ 下的8个重复文件
2. **未使用组件清理**：删除 home 目录下的2个组件
3. **未使用目录清理**：删除整个 search 目录
4. **未使用UI组件清理**：删除 ui/tabs.tsx
5. **冗余代码清理**：移除 PostCard.tsx 中的 ClockIcon 导入

### 删除文件清单

**components/profile/ 目录下的重复组件：**

- ActivityTimeline.tsx
- AvatarUploader.tsx
- BadgeCollection.tsx
- EditModeForm.tsx
- ProfileHeader.tsx
- SkillCloud.tsx
- SocialLinksCard.tsx
- UserStats.tsx

**components/home/ 目录下的未使用组件：**

- ProfilePanel.tsx
- Sidebar.tsx

**components/search/ 目录（整个目录）：**

- SearchBar.tsx

**components/ui/ 目录下的未使用组件：**

- tabs.tsx

**修改文件：**

- components/blog/PostCard.tsx（移除 ClockIcon 导入）

### 实施步骤

1. 确认所有删除文件的引用关系，确保不会破坏现有功能
2. 按顺序删除重复组件和未使用文件
3. 修改 PostCard.tsx 中的导入语句
4. 验证项目编译无错误

## 实现细节

### 文件清理操作

```
# 删除重复的 profile 组件
rm -rf frontend/src/components/profile/

# 删除未使用的 home 组件
rm frontend/src/components/home/ProfilePanel.tsx
rm frontend/src/components/home/Sidebar.tsx

# 删除 search 目录
rm -rf frontend/src/components/search/

# 删除未使用的 tabs UI 组件
rm frontend/src/components/ui/tabs.tsx

# 修改 PostCard.tsx
# 移除第6行导入中的 ClockIcon
```

### PostCard.tsx 修改

修改第6行，从：

```typescript
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
```

改为：

```typescript
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
```

## 技术考量

### 安全性

- 删除前需确认文件未被引用
- 保留 app/profile/components/ 中的版本作为唯一来源
- 避免影响现有功能

### 验证策略

- 运行 `npm run build` 确保编译通过
- 检查是否有 TypeScript 类型错误
- 确认所有页面功能正常