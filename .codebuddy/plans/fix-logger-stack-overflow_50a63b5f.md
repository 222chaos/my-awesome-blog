---
name: fix-logger-stack-overflow
overview: 修复 logger.ts 中的无限递归导致的栈溢出问题。虽然代码本身看起来没有递归，但可能在运行时或编译时出现了问题。需要诊断并修复。
todos:
  - id: stop-dev-server
    content: 停止前端开发服务器
    status: completed
  - id: clear-cache
    content: 清除 .next 缓存目录
    status: completed
    dependencies:
      - stop-dev-server
  - id: restart-dev-server
    content: 重启开发服务器验证修复
    status: completed
    dependencies:
      - clear-cache
---

## 用户需求

修复 "Maximum call stack size exceeded" 错误，该错误发生在 `frontend/src/utils/logger.ts` 的第 40 行 `Logger.log` 方法中

## 问题分析

1. `logger.ts` 文件已修复：私有方法已从 `log` 重命名为 `_log`，避免与公共方法 `log` 冲突
2. 错误持续出现，最可能的原因是 **Next.js 开发服务器缓存了旧代码**
3. Next.js 使用 Turbopack，缓存存储在 `.next/` 目录中
4. 需要清除缓存并重启开发服务器以使修复生效

## 技术方案

### 1. 停止开发服务器

终止当前运行的 Next.js 开发服务器进程（Ctrl+C）

### 2. 清除 Next.js 缓存

删除 `.next/` 目录中的缓存文件，特别是：

- `.next/cache/` - Turbopack 缓存
- `.next/dev/` - 开发构建缓存
- `.next/server/` - 服务器端构建缓存

### 3. 重启开发服务器

使用以下命令启动开发服务器：

```
cd frontend
npm run dev
```

## 实现细节

### 执行步骤

1. 确认 `logger.ts` 已正确修复（私有方法为 `_log`）
2. 停止开发服务器
3. 删除缓存目录：`rm -rf frontend/.next/cache frontend/.next/dev frontend/.next/server`
4. 重启开发服务器
5. 验证错误是否已解决

### 关键注意事项

- 在 Windows 系统上使用 PowerShell 删除目录：`Remove-Item -Recurse -Force frontend/.next/cache`
- 清除缓存后首次启动可能需要较长时间重新构建
- 确保 `logger.ts` 修复已保存且未被 git 恢复

## 架构说明

```
Frontend (Next.js)
├── src/utils/logger.ts [已修复]
│   ├── private _log(level, ...args) - 内部实现
│   └── public log(...args) -> this._log('log', ...args)
├── .next/cache/ [需要清除]
├── .next/dev/ [需要清除]
└── .next/server/ [需要清除]
```

## 依赖项

- Next.js 16.1.6 + Turbopack
- Node.js 运行环境