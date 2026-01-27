---
name: clean-frontend-unused-code
overview: 清理前端项目中的重复组件、未使用的文件和冗余代码，包括删除重复的 profile 组件、未使用的 home 组件、search 组件以及清理 PostCard 中未使用的导入
todos:
  - id: delete-app-profile-components
    content: 删除 app/profile/components/ 目录下的所有重复组件文件
    status: pending
  - id: delete-unused-home-components
    content: 删除 components/home/ 目录下未使用的 5 个组件
    status: pending
  - id: delete-search-component
    content: 删除 components/search/ 目录及其内容
    status: pending
  - id: delete-unused-ui-component
    content: 删除 components/ui/tabs.tsx 未使用的 UI 组件
    status: pending
  - id: clean-postcard-imports
    content: 清理 PostCard.tsx 中未使用的 ClockIcon 导入
    status: pending
---

## 产品概述

清理前端项目中的冗余代码，删除重复组件、未使用的文件和未使用的导入，提升代码质量和可维护性。

## 核心功能

- 删除 `app/profile/components/` 目录下的重复 profile 组件（4个文件）
- 删除 `components/home/` 目录下未使用的组件（5个文件）
- 删除 `components/search/` 目录下的 SearchBar 组件
- 删除未使用的 UI 组件 tabs.tsx
- 清理 PostCard.tsx 中未使用的 ClockIcon 导入