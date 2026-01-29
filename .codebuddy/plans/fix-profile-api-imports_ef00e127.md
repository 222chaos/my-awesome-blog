---
name: fix-profile-api-imports
overview: 修复 profile 页面的 API 导入错误，在 profile.ts 中添加缺失的导出函数
todos:
  - id: update-userstats-interface
    content: 扩展 UserStats 接口，添加缺失的字段
    status: completed
  - id: update-mock-stats-data
    content: 更新 getMockUserStats 返回数据
    status: completed
    dependencies:
      - update-userstats-interface
  - id: add-export-aliases
    content: 添加函数导出别名和新函数
    status: completed
    dependencies:
      - update-mock-stats-data
---

## 产品概述

修复 Next.js 应用中 profile 页面的导入错误，使 profile/page.tsx 能够正确导入和使用 API 函数

## 核心功能

- 在 profile.ts 中添加缺失的 API 函数导出
- 扩展 UserStats 接口以匹配页面组件使用的字段
- 实现 fetchCurrentUserProfile、fetchCurrentUserStats、updateUserProfile、uploadAvatar 函数
- 保持现有 mock 函数的功能完整性

## Tech Stack

- Next.js 16.1.6
- TypeScript
- React Hooks

## 实现方案

在 frontend/src/lib/api/profile.ts 文件中添加缺失的 API 函数导出：

1. 扩展 UserStats 接口，添加 article_count、comment_count、total_views、joined_date 字段
2. 创建 fetchCurrentUserProfile 作为 getMockUserProfile 的别名
3. 创建 fetchCurrentUserStats 作为 getMockUserStats 的别名
4. 创建 updateUserProfile 作为 updateMockUserProfile 的别名
5. 创建新的 uploadAvatar 函数，返回 { avatar_url: string } 格式

## 实现细节

### 核心目录结构

```
project-root/
└── frontend/src/
    └── lib/api/
        └── profile.ts  # 修改：添加缺失的函数导出
```

### 关键代码结构

**扩展 UserStats 接口**：

```typescript
export interface UserStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
  article_count?: number;
  comment_count?: number;
  total_views?: number;
  joined_date?: string;
}
```

**添加导出别名和函数**：

```typescript
// 导出别名
export const fetchCurrentUserProfile = getMockUserProfile;
export const fetchCurrentUserStats = getMockUserStats;
export const updateUserProfile = updateMockUserProfile;

// 上传头像函数
export const uploadAvatar = async (file: File): Promise<{ avatar_url: string }> => {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 创建 base64 URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ avatar_url: reader.result as string });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### 技术考量

- **向后兼容**：保留原有的 Mock 函数导出，确保其他引用该文件的代码不受影响
- **扩展性**：UserStats 接口扩展使用可选字段，保持向后兼容
- **代码一致性**：新函数命名遵循 RESTful API 命名规范（fetch*、update*）