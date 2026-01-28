# My Awesome Blog 项目规则

## 1. 项目架构与技术栈

### 1.1 整体架构
- **单体仓库结构**：`frontend/` (Next.js 14 + TypeScript) 和 `backend/` (FastAPI + PostgreSQL)
- **前端**：Next.js 14 App Router, TypeScript, Tailwind CSS, Jest, ESLint, Prettier
- **后端**：FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, pytest
- **数据库**：PostgreSQL (生产环境), SQLite (开发环境)
- **容器化**：Docker Compose 用于本地开发

### 1.2 文件组织
- `frontend/` - Next.js 前端应用程序
- `backend/` - FastAPI 后端应用程序
- `docs/` - 文档
- `.github/` - GitHub 配置
- `__tests__/` - 共享测试工具

## 2. 开发规范

### 2.1 前端开发规范

#### TypeScript/React 规范
- 使用 `interface` 而非 `type` 定义对象形状
- 启用严格 TypeScript 模式 (如 `tsconfig.json` 中配置)
- 使用 `React.ReactNode` 作为 children 类型
- 函数组件配合 hooks (避免类组件)
- 默认导出组件
- 显式键入所有 props 和返回值
- 避免 `any` 类型；使用 `unknown` 或适当类型代替
- 使用 React.forwardRef 当需要 DOM 访问时
- 对频繁渲染且 props 相同的组件实现 React.memo
- 使用 useCallback/useMemo 优化昂贵计算

#### 导入模式
- 分组导入：React → 外部库 → 内部模块
- 使用绝对导入通过 `@/*` 别名：`import GlassCard from '@/components/ui/GlassCard'`
- 导入 `cn` 工具用于条件类名：`import { cn } from '@/lib/utils'`
- 在组件签名中解构 props

#### 组件结构
- 组件默认导出：`export default function ComponentName() { ... }`
- 定义 prop 接口：`interface ComponentProps { ... }`
- 当需要 DOM 访问时使用 forwardRef
- 为所有 props 实现适当的 TypeScript 类型
- 遵循无障碍最佳实践 (ARIA 标签, 语义化 HTML)

#### Tailwind CSS 样式规范
- 仅使用 Tailwind 实用类
- 利用 `tailwind.config.js` 中的自定义玻璃化类
- 使用 `cn()` 工具用于条件类：`className={cn("base classes", condition && "conditional classes")}`
- 应用玻璃化效果：`bg-glass/30`, `backdrop-blur-xl`, `border-glass-border`
- 使用科技主题颜色：`tech-darkblue`, `tech-cyan`, `tech-lightcyan`, `tech-sky`
- 实现动画使用预定义关键帧：`glass-float`, `pulse-glow`, `fade-in-up`
- 使用 Tailwind 断点前缀：`sm:`, `md:`, `lg:`, `xl:`
- 使用 flexbox 和 grid 布局：`flex`, `grid`, `gap`, `justify-center`, `items-center`

#### 文件命名约定
- 组件：`PascalCase.tsx` (例如 `GlassCard.tsx`)
- 工具/钩子：`camelCase.ts` (例如 `useMediaQuery.ts`, `utils.ts`)
- 页面：`page.tsx` (Next.js App Router)
- 布局：`layout.tsx`
- TypeScript 工具文件：`.ts` 扩展名
- 服务组件：使用 `.tsx` 扩展名，若需要客户端功能则添加 `'use client'` 指令

### 2.2 后端开发规范

#### Python/FastAPI 规范
- 在所有函数签名中使用类型提示
- 使用 Pydantic 模型进行请求/响应验证
- 使用依赖注入 `Depends` 进行身份验证和数据库会话
- 实现 async/await 进行异步操作
- 遵循 FastAPI 最佳实践进行路径操作
- 使用 HTTPException 进行错误响应
- 使用 APIRouter 结构化端点
- 全局异常处理器位于 `app/core/exception_handler.py`

#### SQLAlchemy/ORM 规范
- 使用 SQLAlchemy 2.0 语法
- 定义继承自 `Base` 的模型 (来自 `app.core.database`)
- 使用 `relationship()` 和 `back_populates` 实现关系
- 使用适当的类型和约束定义 `Column`
- 在适当时应用级联操作 (例如 `cascade="all, delete-orphan"`)
- 使用 UUID 作为主键类型

#### Pydantic 模式规范
- 从 `BaseModel` 继承所有模式
- 使用继承实现模式变化 (例如 `ArticleBase`, `ArticleCreate`, `ArticleUpdate`)
- 实现适当的验证与字段类型和约束
- 使用 `Config.from_attributes = True` 实现 ORM 兼容
- 使用 `Optional[type]` 和默认值处理可选字段

#### 错误处理
- 使用 FastAPI 的 `HTTPException` 处理 HTTP 错误
- 实现适当的 HTTP 状态码 (400, 401, 403, 404, 500 等)
- 使用 `app.utils.logger.app_logger` 记录错误
- 返回用户友好的错误消息
- 在操作前验证权限和业务逻辑
- 统一错误响应格式在 `app/schemas/error.py` 中定义

#### 文件命名约定
- Python 模块：`snake_case.py` (例如 `article.py`)
- 测试文件：`test_*.py` (例如 `test_auth.py`)
- API 端点：在 `endpoints/` 目录中使用 `snake_case.py`
- 模型/模式文件：匹配实体名称 (例如 `article.py`, `user.py`)

## 3. 设计系统原则

### 3.1 玻璃化实现
- 使用 `bg-glass/30` 实现半透明背景
- 应用 `backdrop-blur-xl` 实现模糊效果
- 使用 `border border-glass-border` 实现微妙边框
- 使用 `text-white` 在玻璃背景下实现文本对比
- 实现 `glass-float` 动画实现浮动效果
- 应用 `pulse-glow` 实现交互元素

### 3.2 色彩方案
- 主要科技色彩：`tech-darkblue (#0f172a)`, `tech-deepblue (#1e3a8a)`
- 青色强调色：`tech-cyan (#06b6d4)`, `tech-lightcyan (#22d3ee)`, `tech-sky (#0ea5e9)`
- 玻璃色彩：`glass` (rgba(15, 23, 42, 0.5)), `glass-light`, `glass-border`, `glass-glow`
- 避免通用色彩方案；坚持定义的调色板

### 3.3 字体排版
- 使用 Inter 字体，如 `layout.tsx` 中配置
- 维持良好的对比比例以保证无障碍访问
- 使用 Tailwind 比例的适当字体权重和大小
- 避免通用字体 (Inter/Roboto) 用于标题，当有自定义替代时

### 3.4 运动与动画
- 使用 `tailwind.config.js` 中预定义的动画
- 应用 `fade-in-up` 实现从底部出现的内容
- 使用 `slide-in-left` 实现从左侧进入的元素
- 实现 `scale-fade-in` 实现平滑入口效果
- 使用 `ripple` 实现交互反馈
- 应用 `pulse-glow` 用于重要元素
- 应用 `glass-float` 实现玻璃卡片的微妙浮动效果
- 使用 `gradient-move` 实现动画渐变背景
- 避免分散注意力的过度动画
- 使用 `delay-100` 和 `delay-200` 实现交错动画延迟
- 使用 `animate-fade-in-up` 或 `animate-slide-in-left` 实现入口动画

### 3.5 间距与布局
- 遵循一致的间距模式使用 Tailwind 比例 (p-4, p-6, p-8 等)
- 使用适当尺寸维持视觉层次 (text-sm, text-base, text-lg, text-xl)
- 使用玻璃卡片作为内容容器
- 应用适当的填充和边距以保证可读性
- 平衡透明度和不透明度以保证视觉清晰
- 使用 flexbox 和 grid 布局实现响应式设计
- 使用 `gap-x-*` 和 `gap-y-*` 实现一致的间隔

### 3.6 反模式避免
- 通用字体堆栈 (避免默认 Inter/Roboto 未定制化)
- 陈词滥调的色彩方案 (避免常见的蓝色/白色/灰色调)
- 可预测的布局 (避免标准卡片网格无玻璃处理)
- 重实心背景 (当玻璃化合适时避免使用)
- 静态内容无细微运动 (适度但有效地使用动画)

## 4. 代码质量与标准

### 4.1 前端标准
- 遵循 `eslint.config.js` 中定义的 ESLint 规则
- 遵循 `.prettierrc.json` 中定义的 Prettier 格式化
- 使用驼峰命名法 (属性：`never`)
- 优先使用 `const` 而非 `let`，避免 `var`
- 使用严格相等 (`===` 和 `!==`)
- 启用 TypeScript 严格模式

### 4.2 后端标准
- 遵循 PEP 8 Python 风格指南
- 一致使用类型提示
- 遵循 FastAPI 最佳实践
- 为函数和类实现适当的文档字符串
- 使用有意义的变量和函数名
- 按照代码库中的现有模式结构化代码

### 4.3 导入/导出模式
- 前端：使用 `@/` 别名的绝对导入
- 后端：使用 `app` 包内的绝对导入
- 逻辑分组导入 (标准库 → 第三方 → 本地模块)

### 4.4 测试指南
- 前端：使用 Jest 与 React Testing Library
- 后端：使用 pytest 与 TestClient 进行 API 测试
- 编写关注用户交互的测试
- 适当地模拟外部依赖
- 维持 50%+ 的覆盖阈值，如配置

## 5. 特殊功能与实现

### 5.1 缓存层
- 使用 Redis 作为缓存后端
- 使用 `aioredis` 库进行异步操作
- 实现通用的缓存服务类
- 缓存服务位于 `app/services/cache_service.py`
- 主要缓存热点数据，如文章详情、用户信息等
- 实现 `cache_get_or_set` 便捷函数

### 5.2 游标分页
- 游标分页是一种高效的分页方法，特别适用于大数据集
- 相比传统的偏移分页，游标分页在大数据集上性能更好
- 分页工具位于 `app/utils/pagination.py`
- 游标分页函数已添加到各个 CRUD 模块
- API 端点 `/articles/cursor-paginated` 提供游标分页功能

### 5.3 全文搜索
- 使用 PostgreSQL 的全文搜索功能
- 创建 `search_vector` 列和 GIN 索引
- 使用 `tsvector` 和 `tsquery` 进行搜索
- API 端点 `/api/v1/articles/search-fulltext` 提供全文搜索功能

### 5.4 审计日志
- 审计日志记录系统中的关键操作
- 记录包括：用户ID、操作类型、资源类型和ID、旧值和新值（JSON格式）、IP地址和用户代理、时间戳
- 审计日志端点仅对超级用户开放
- 审计日志模型位于 `app/models/logs/audit_log.py`

### 5.5 数据分析
- 提供更丰富的统计信息，如文章增长统计、用户参与度统计、顶级作者排行、月度统计、内容洞察
- 数据分析端点仅对超级用户开放
- 数据分析函数位于 `app/crud/analytics.py`

### 5.6 数据库优化
- 为提高查询性能，添加了以下索引：文章表的 `is_published`, `published_at`, `view_count` 等字段
- 添加复合索引用于常见查询模式
- 添加全文搜索的 GIN 索引
- 使用数据库连接池优化配置

## 6. 环境变量与配置

### 6.1 后端配置
- 必须设置 `SECRET_KEY` 为强随机值
- 必须配置 `DATABASE_URL`
- 必须设置 `REDIS_HOST`
- 如果启用邮件功能，必须配置 `SMTP_HOST` 和凭据

### 6.2 前端配置
- 环境变量需要 `NEXT_PUBLIC_` 前缀才能在浏览器中访问

## 7. UUID 主键处理规范

### 7.1 健壮性实践
- CRUD 函数应接收 str 类型参数（而非 UUID 类型）
- 在函数内部用 try-except 包裹 UUID() 构造，捕获 ValueError 并返回 None/False
- 参数统一声明为 str
- 导入 uuid 模块，在函数内尝试 `UUID(input_str)`
- 校验失败时静默处理（不抛 500），返回 None 或 False
- 校验成功后，用生成的 UUID 对象查询数据库（确保类型匹配）
- 此做法可避免因前端传入非法字符串导致的 500 错误

## 8. 性能与无障碍要求

### 8.1 性能优化
- 适当优化图像和资产
- 对屏幕下方的组件使用懒加载
- 在适当情况下实现正确的代码分割与动态导入
- 通过避免不必要的依赖最小化包大小
- 优化后端操作中的数据库查询
- 在适当情况下使用记忆化技术 (useMemo, useCallback)

### 8.2 无障碍标准
- 实现适当的 ARIA 标签和属性
- 确保语义化 HTML 结构
- 维持键盘可导航性
- 遵循 WCAG 关于颜色对比的指南
- 为图像提供替代文本
- 为交互元素使用焦点指示器
- 确保屏幕阅读器兼容性