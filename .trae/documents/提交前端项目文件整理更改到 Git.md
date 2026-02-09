## Git 提交计划

### 变更概述

#### 后端更改
- 修改: `app/api/v1/endpoints/albums.py`, `auth.py`
- 修改: `scripts/seed/create_rich_albums.py`
- 清理: 删除了大量过时的测试脚本和数据库初始化脚本

#### 前端更改
- 修改: `app/albums/page.tsx` - 统一类型定义
- 修改: `app/login/login-content.tsx` - 更新样式导入路径
- 删除: `app/login/form-styles.css` - 迁移至 styles 目录
- 删除: `app/posts/media-player-test/page.tsx` - 测试页面
- 删除: `components/ui/NeonCard.tsx` - 未使用组件
- 修改: 多个组件的主题支持改进
- 修改: `types/index.ts` - 统一 Album 接口定义

### 提交步骤

1. 添加所有前端和后端更改
2. 创建提交：描述文件整理和类型统一
3. 忽略 `.codebuddy` 和 `.trae` 等文档目录（已在 .gitignore 中排除）

### 提交信息
```
refactor: 清理前端项目文件并统一类型定义

- 删除未使用的组件 (NeonCard, RankingCard, media-player-test)
- 移动登录样式到 styles/components/login-form.css
- 统一 Album 类型定义到 types/index.ts
- 更新多个组件的导入路径
- 清理后端过时脚本文件
```

### .gitignore 检查
- `.codebuddy/` 目录已被忽略 ✓
- `.trae/` 目录已被忽略 ✓
- `venv/` 目录已被忽略 ✓