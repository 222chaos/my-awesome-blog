## Git 提交计划

### 当前改动概览

**后端改动**：
- `app/api/v1/endpoints/messages.py` - 新增弹幕相关 API
- `app/crud/message.py` - 新增热门弹幕和活动统计功能
- `app/core/config.py` - OSS 配置更新
- `app/api/v1/endpoints/articles.py` - 文章相关更新
- `app/api/v1/endpoints/images.py` - 图片相关更新

**前端改动**：
- `src/app/messages/page.tsx` - 赛博朋克风格留言板完整重构
- `src/app/layout.tsx` - 集成 Toaster 组件
- `src/components/ui/avatar.tsx` - 新增头像组件
- `src/components/ui/GlitchText.tsx` - 新增故障文字组件
- `src/components/ui/NeonCard.tsx` - 新增霓虹卡片组件
- `src/components/ui/CyberButton.tsx` - 新增赛博按钮组件
- `src/components/ui/use-toast.ts` - 新增 Toast Hook
- `src/components/ui/toaster.tsx` - 新增 Toast 组件
- 各种服务文件更新

**新增脚本**：
- `scripts/seed_danmaku.py` - 弹幕数据初始化脚本

### 执行步骤

1. **添加改动文件到暂存区**
   - 添加所有修改的代码文件
   - 添加新的 UI 组件
   - 添加弹幕数据脚本
   - **排除** `.trae/documents/` 目录（AI 生成文档不应提交）

2. **创建提交**
   - 使用中文提交信息
   - 概述主要功能：赛博朋克风格留言板、弹幕功能、新增 UI 组件

3. **推送到远程仓库**（可选）
   - 检查是否需要推送