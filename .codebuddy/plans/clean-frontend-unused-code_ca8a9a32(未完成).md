---
name: clean-frontend-unused-code
overview: 清理前端项目中的重复组件、未使用的文件和冗余代码，包括删除重复的 profile 组件（保留 app/profile/components/ 版本）、未使用的 home 组件、search 组件以及清理 PostCard 中未使用的导入
todos:
  - id: delete-duplicate-profile-components
    content: 删除 components/profile/ 目录下的所有重复组件文件（8个文件）
    status: pending
  - id: delete-unused-home-components
    content: 删除 components/home/ 目录下的未使用组件 ProfilePanel 和 Sidebar
    status: pending
  - id: delete-unused-search-component
    content: 删除 components/search/ 目录下的未使用组件 SearchBar
    status: pending
  - id: clean-postcard-imports
    content: 移除 PostCard.tsx 中未使用的 ClockIcon 导入
    status: pending
---

## Product Overview

清理前端项目中的重复组件、未使用的文件和冗余代码，以提升代码库的整洁度和可维护性

## Core Features

- 删除重复的 profile 组件（保留 app/profile/components/ 版本）
- 删除未使用的 home 组件
- 删除未使用的 search 组件
- 清理 PostCard 中未使用的导入