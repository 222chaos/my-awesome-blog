---
name: build-check-and-cleanup
overview: 运行完整构建检查，识别并修复遗留问题，清理代码冗余
todos:
  - id: tsc-check
    content: 运行 TypeScript 类型检查，记录所有类型错误
    status: completed
  - id: eslint-check
    content: 运行 ESLint 检查，获取 lint 错误和警告
    status: completed
    dependencies:
      - tsc-check
  - id: code-exploration
    content: 使用 [subagent:code-explorer] 搜索代码中的问题（重复导入、未使用变量、TODO等）
    status: completed
  - id: build-check
    content: 运行 Next.js 生产构建，验证构建成功
    status: completed
    dependencies:
      - tsc-check
      - eslint-check
  - id: fix-imports
    content: 清理未使用的导入语句（RealTimeStats.tsx、其他组件）
    status: completed
    dependencies:
      - code-exploration
  - id: fix-variables
    content: 删除未使用的变量和函数
    status: completed
    dependencies:
      - code-exploration
  - id: fix-logic
    content: 检查并修复组件逻辑问题（useEffect依赖、性能优化）
    status: completed
    dependencies:
      - code-exploration
  - id: verify-build
    content: 重新运行构建检查，验证所有问题已修复
    status: completed
    dependencies:
      - fix-imports
      - fix-variables
      - fix-logic
---

## 任务概述

对留言页面优化内容进行全面质量检查和代码清理。

## 具体需求

### 1. 构建检查

- 运行 TypeScript 类型检查 (tsc --noEmit)
- 运行 ESLint 检查 (next lint)
- 运行 Next.js 生产构建 (next build)
- 验证所有模块导入正确

### 2. 遗留问题检查

- 检查重复导入语句
- 检查未使用的变量和函数
- 检查未使用的 React Hooks
- 检查 console.log 等调试代码
- 检查 TODO/FIXME 注释

### 3. 组件逻辑检查

- RealTimeStats.tsx：状态管理、useEffect 依赖、性能优化
- VirtualMessageList.tsx：虚拟滚动逻辑、事件处理
- EnhancedDanmaku.tsx：动画性能、内存泄漏
- MarkdownRenderer.tsx：安全性、渲染性能

### 4. 代码清理

- 删除未使用的导入
- 删除未使用的变量
- 删除冗余的注释
- 优化重复代码
- 删除测试用的 console.log

## 检查范围

- 前端项目：frontend/src/components/messages/ 目录
- 相关 UI 组件：frontend/src/components/ui/
- 主页面：frontend/src/app/messages/page.tsx

## 技术栈

- Next.js 14 + React 18 + TypeScript
- ESLint (Next.js 默认配置)
- Tailwind CSS

## 检查工具

1. **TypeScript 编译器**：tsc --noEmit
2. **ESLint**：next lint
3. **Next.js 构建**：next build
4. **手动代码审查**：检查逻辑合理性

## 检查清单

### 构建检查

- [ ] 无 TypeScript 类型错误
- [ ] 无 ESLint 错误
- [ ] Next.js 构建成功
- [ ] 无模块解析错误

### 代码质量检查

- [ ] 无重复导入
- [ ] 无未使用的导入
- [ ] 无未使用的变量
- [ ] 无 console.log (生产代码)
- [ ] 组件 props 类型完整

### 性能检查

- [ ] useEffect 依赖完整
- [ ] memo/useMemo 使用合理
- [ ] 无内存泄漏风险
- [ ] 事件监听正确清理

## 推荐使用的扩展

### SubAgent

- **code-explorer**
- 用途：搜索整个代码库中的问题（重复导入、未使用变量、TODO注释等）
- 预期结果：提供完整的代码质量问题列表

### Skill

- 无需额外技能，使用标准工具链即可执行