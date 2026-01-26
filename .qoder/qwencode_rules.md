# Qwen Code Rules for My Awesome Blog

## 触发条件
- 在处理此项目的代码时始终启用

## 项目概述与技术栈

My Awesome Blog 是一个现代单体仓库项目，包含：
- **前端**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **后端**: FastAPI with Python, SQLAlchemy 2.0, Pydantic v2
- **数据库**: PostgreSQL (生产环境), SQLite (开发环境)
- **设计系统**: 玻璃拟态设计配科技主题色彩方案
- **架构**: Docker容器化部署

## 角色定义

作为具有以下专业技能的高级全栈开发者：
- 现代React/Next.js开发模式
- FastAPI和异步Python开发
- 使用SQLAlchemy ORM进行数据库设计
- 玻璃拟态UI/UX设计原则
- 企业级代码质量和架构

## 架构指南

### 单体仓库结构
- `frontend/` - Next.js应用，使用App Router
- `backend/` - FastAPI应用，包含API v1端点
- `docs/` - 文档文件
- 根级别共享配置文件

### 前端架构
- Next.js 14 with App Router (`app/` 目录结构)
- TypeScript with 严格模式启用
- Tailwind CSS 样式配合自定义主题
- 组件组织: `components/ui`, `components/blog`, `components/home`
- 使用 `@/*` 别名的绝对导入 (在 `tsconfig.json` 中配置)

### 后端架构
- FastAPI with APIRouter 用于端点组织
- SQLAlchemy 2.0 ORM with 异步支持
- Pydantic v2 用于请求/响应验证
- CRUD操作分离在 `app/crud/`
- 模型定义在 `app/models/`
- 模式定义在 `app/schemas/`
- 依赖注入用于身份验证和数据库会话

## 前端开发指南

### TypeScript/React 模式
- 对对象形状使用 `interface` 而非 `type`
- 启用严格TypeScript模式 (如 `tsconfig.json` 中配置)
- 使用 `React.ReactNode` 作为children属性
- 函数组件配合Hooks (避免类组件)
- 默认导出组件
- 为所有属性和返回值显式类型注解
- 避免 `any` 类型；使用 `unknown` 或正确类型
- 在需要DOM访问时使用React.forwardRef
- 为频繁渲染相同属性的组件实现React.memo
- 为昂贵计算使用useCallback/useMemo以优化性能

### 导入模式
- 分组导入: React → 外部库 → 内部模块
- 使用 `@/*` 别名的绝对导入: `import GlassCard from '@/components/ui/GlassCard'`
- 导入 `cn` 工具用于条件类名: `import { cn } from '@/lib/utils'`
- 解构组件签名中的属性
- 示例导入模式:
  ```typescript
  import { useState, useEffect } from 'react';
  import { Button } from '@/components/ui/button';
  import GlassCard from '@/components/ui/GlassCard';
  import { cn } from '@/lib/utils';
  ```

### 组件结构
- 组件的默认导出: `export default function ComponentName() { ... }`
- 定义属性接口: `interface ComponentProps { ... }`
- 在需要DOM访问时使用forwardRef
- 为所有属性实现适当的TypeScript类型
- 遵循无障碍最佳实践 (ARIA标签, 语义化HTML)
- 示例组件结构:
  ```typescript
  interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'glass';
    className?: string;
  }

  const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, variant = 'default', className, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border',
            variant === 'glass' && 'bg-glass/30 backdrop-blur-xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  );
  Card.displayName = 'Card';
  export default Card;
  ```

### Tailwind CSS样式
- 仅使用Tailwind实用类
- 利用来自 `tailwind.config.js` 的自定义玻璃拟态类
- 使用 `cn()` 工具进行条件类: `className={cn("base classes", condition && "conditional classes")}`
- 应用玻璃拟态效果: `bg-glass`, `backdrop-blur-xl`, `border-glass-border`
- 使用科技主题颜色: `tech-darkblue`, `tech-cyan`, `tech-lightcyan`, `tech-sky`
- 实现预定义关键帧动画: `glass-float`, `pulse-glow`, `fade-in-up`
- 使用Tailwind断点前缀应用响应式设计: `sm:`, `md:`, `lg:`, `xl:`
- 使用flexbox和grid布局: `flex`, `grid`, `gap`, `justify-center`, `items-center`

### 文件命名约定
- 组件: `PascalCase.tsx` (例如, `GlassCard.tsx`)
- 工具函数/钩子: `camelCase.ts` (例如, `useMediaQuery.ts`, `utils.ts`)
- 页面: `page.tsx` (Next.js App Router)
- 布局: `layout.tsx`
- TypeScript工具文件: `.ts` 扩展名
- 服务端组件: 使用 `.tsx` 扩展名，客户端组件需添加 `'use client'` 指令

## 后端开发指南

### Python/FastAPI 模式
- 在所有函数签名中使用类型提示
- 利用Pydantic模型进行请求/响应验证
- 使用 `Depends` 进行依赖注入以实现身份验证和数据库会话
- 实现async/await用于异步操作
- 遵循FastAPI路径操作的最佳实践
- 使用HTTPException进行错误响应
- 使用APIRouter构建端点
- 示例端点模式:
  ```python
  from fastapi import APIRouter, Depends, HTTPException, status
  from sqlalchemy.orm import Session
  from app.core.database import get_db
  from app.schemas.article import Article, ArticleCreate
  from app import crud

  router = APIRouter()

  @router.post("/", response_model=Article)
  def create_article(
      *,
      db: Session = Depends(get_db),
      article_in: ArticleCreate,
  ) -> Any:
      """
      创建新文章
      """
      article = crud.create_article(db, article=article_in)
      return article
  ```

### SQLAlchemy/ORM 模式
- 使用SQLAlchemy 2.0语法
- 定义继承自 `Base` 的模型 (来自 `app.core.database`)
- 使用 `relationship()` 和 `back_populates` 实现关系
- 使用 `Column` 定义适当类型和约束
- 在适当时应用级联操作 (例如, `cascade="all, delete-orphan"`)
- 示例模型模式:
  ```python
  from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
  from sqlalchemy.sql import func
  from sqlalchemy.orm import relationship
  from app.core.database import Base

  class Article(Base):
      __tablename__ = "articles"

      id = Column(Integer, primary_key=True, index=True)
      title = Column(String(200), nullable=False)
      content = Column(Text, nullable=False)
      is_published = Column(Boolean, default=False)
      created_at = Column(DateTime(timezone=True), server_default=func.now())

      # 外键
      author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

      # 关系
      author = relationship("User", back_populates="articles")
  ```

### Pydantic 模式
- 从 `BaseModel` 继承所有模式
- 使用继承实现模式变体 (例如, `ArticleBase`, `ArticleCreate`, `ArticleUpdate`)
- 使用字段类型和约束实现适当验证
- 使用 `Config.from_attributes = True` 实现ORM兼容性
- 使用 `Optional[type]` 和默认值处理可选字段
- 示例模式:
  ```python
  from pydantic import BaseModel
  from typing import Optional
  from datetime import datetime

  class ArticleBase(BaseModel):
      title: str
      content: str
      is_published: bool = False

  class ArticleCreate(ArticleBase):
      pass

  class ArticleUpdate(BaseModel):
      title: Optional[str] = None
      content: Optional[str] = None
      is_published: Optional[bool] = None

  class ArticleInDBBase(ArticleBase):
      id: int
      created_at: datetime

      class Config:
          from_attributes = True

  class Article(ArticleInDBBase):
      pass
  ```

### 错误处理
- 使用FastAPI的 `HTTPException` 处理HTTP错误
- 实现适当的HTTP状态码 (400, 401, 403, 404, 500等)
- 使用 `app.utils.logger.app_logger` 记录错误
- 返回用户友好的错误消息
- 在操作前验证权限和业务逻辑
- 示例错误处理:
  ```python
  from fastapi import HTTPException, status
  from app.utils.logger import app_logger

  def get_article(db: Session, article_id: int):
      article = db.query(Article).filter(Article.id == article_id).first()
      if not article:
          app_logger.warning(f"尝试访问不存在的文章ID: {article_id}")
          raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail="文章未找到",
          )
      return article
  ```

### 文件命名约定
- Python模块: `snake_case.py` (例如, `article.py`)
- 测试文件: `test_*.py` (例如, `test_auth.py`)
- API端点: `snake_case.py` 在 `endpoints/` 目录
- 模型/模式文件: 匹配实体名称 (例如, `article.py`, `user.py`)

## 设计系统原则

### 玻璃拟态实现
- 使用 `bg-glass/30` 实现半透明背景
- 应用 `backdrop-blur-xl` 实现模糊效果
- 使用 `border border-glass-border` 实现微妙边框
- 添加 `text-white` 实现玻璃背景上的文本对比
- 实现 `glass-float` 动画实现浮动效果
- 应用 `pulse-glow` 实现交互元素

### 色彩方案
- 主要科技颜色: `tech-darkblue (#0f172a)`, `tech-deepblue (#1e3a8a)`
- 青色强调: `tech-cyan (#06b6d4)`, `tech-lightcyan (#22d3ee)`, `tech-sky (#0ea5e9)`
- 玻璃颜色: `glass` (rgba(15, 23, 42, 0.5)), `glass-light`, `glass-border`, `glass-glow`
- 避免通用颜色方案；坚持定义的调色板

### 排版
- 使用在 `layout.tsx` 中配置的Inter字体
- 维持良好的对比度比以确保无障碍性
- 使用Tailwind比例尺的适当字重和大小
- 避免通用字体 (Inter/Roboto) 用于标题，当有自定义替代方案时

### 动效
- 使用 `tailwind.config.js` 中预定义的动画
- 应用 `fade-in-up` 实现从底部出现的内容
- 使用 `slide-in-left` 实现从左侧进入的元素
- 实现 `scale-fade-in` 实现平滑入口效果
- 使用 `ripple` 实现交互反馈
- 应用 `pulse-glow` 用于重要元素
- 为玻璃卡片应用 `glass-float` 微妙浮动效果
- 使用 `gradient-move` 实现动画渐变背景
- 避免分散内容注意力的过度动画
- 使用 `delay-100` 和 `delay-200` 实现交错动画延迟
- 使用 `animate-fade-in-up` 或 `animate-slide-in-left` 实现入口动画

### 间距与构成
- 遵循使用Tailwind比例尺的一致间距模式 (p-4, p-6, p-8等)
- 维持使用适当尺寸的良好视觉层次 (text-sm, text-base, text-lg, text-xl)
- 为内容容器使用玻璃卡片
- 为可读性应用适当的内边距和外边距
- 平衡透明度和不透明度以实现视觉清晰度
- 使用flexbox和grid布局实现响应式设计
- 使用 `gap-x-*` 和 `gap-y-*` 类实现一致的间隔

### 应避免的反模式
- 通用字体堆栈 (避免没有自定义的默认Inter/Roboto)
- 陈词滥调的颜色方案 (避免常见的蓝色/白色/灰色调色板)
- 可预测的布局 (避免没有玻璃处理的标准卡片网格)
- 重型纯色背景 (当玻璃拟态适用时避免)
- 没有微妙运动的静态内容 (适度但有效地使用动画)

## 代码质量与标准

### 前端标准
- 遵循 `eslint.config.js` 中定义的ESLint规则
- 遵循 `.prettierrc.json` 中定义的Prettier格式
- 使用camelCase作为变量名 (属性: `never`)
- 优先使用 `const` 而非 `let`，避免 `var`
- 使用严格相等 (`===` 和 `!==`)
- 启用TypeScript严格模式
- 在适当时候实现适当的错误边界

### 后端标准
- 遵循PEP 8 Python风格指南
- 一致使用类型提示
- 遵循FastAPI最佳实践
- 为函数和类实现适当的文档字符串
- 使用有意义的变量和函数名
- 按照代码库中的现有模式构建代码

### 导入/导出模式
- 前端: 使用 `@/` 别名的绝对导入
- 后端: 在 `app` 包内使用绝对导入
- 逻辑分组导入 (标准库 → 第三方 → 本地模块)
- 前端导入分组示例:
  ```typescript
  // React导入
  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/router';

  // 外部库
  import { Button } from '@/components/ui/button';
  import { cn } from '@/lib/utils';

  // 内部模块
  import GlassCard from '@/components/ui/GlassCard';
  import { useTheme } from '@/contexts/theme-context';
  ```
- 后端导入分组示例:
  ```python
  # 标准库
  from typing import Any, List, Optional
  from datetime import datetime

  # 第三方
  from fastapi import APIRouter, Depends, HTTPException, status
  from sqlalchemy.orm import Session

  # 本地模块
  from app.core.database import get_db
  from app.schemas.article import Article, ArticleCreate
  from app import crud
  ```

### 测试指南
- 前端: 使用Jest配合React Testing Library
- 后端: 使用pytest配合TestClient进行API测试
- 编写关注用户交互的测试
- 适当地模拟外部依赖
- 维持配置的50%+覆盖率阈值
- 前端测试示例:
  ```typescript
  import { render, screen, fireEvent } from '@testing-library/react';
  import GlassCard from '@/components/ui/GlassCard';

  describe('GlassCard', () => {
    it('正确渲染子元素', () => {
      render(<GlassCard><div>测试内容</div></GlassCard>);
      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });

    it('启用时应用悬停效果', () => {
      render(<GlassCard hoverEffect={true}>Test</GlassCard>);
      const card = screen.getByText('Test');
      fireEvent.mouseEnter(card);
      expect(card).toHaveClass('hover:-translate-y-1');
    });
  });
  ```
- 后端测试示例:
  ```python
  import pytest
  from fastapi.testclient import TestClient
  from app.main import app

  client = TestClient(app)

  def test_read_main():
      response = client.get("/")
      assert response.status_code == 200
      assert response.json() == {"msg": "欢迎来到我的优秀博客API"}

  @pytest.mark.asyncio
  async def test_create_article():
      article_data = {
          "title": "测试文章",
          "content": "测试内容",
          "is_published": True
      }
      response = client.post("/api/v1/articles/", json=article_data)
      assert response.status_code == 200
      data = response.json()
      assert data["title"] == "测试文章"
  ```

## AI助手指南

### 任务处理方法
1. **先研究**: 在实施前检查代码库中的现有模式
2. **匹配模式**: 遵循既定的架构和编码模式
3. **完成要求**: 专注于具体需求而不扩大范围
4. **无缝融合**: 确保新代码与现有样式和结构匹配
5. **设计过程**: 目的 → 语气 → 约束 → 差异化

### 处理现有代码
- 匹配每个文件中的现有代码样式
- 使用周围代码相同的命名约定
- 遵循相同的架构模式
- 尊重既定的项目结构
- 维持与现有设计选择的一致性

### 问题解决方法
- 不确定实现时，在代码库中查找类似模式
- 优先考虑与现有代码的一致性而非个人偏好
- 引入新功能时，遵循现有功能的相同模式
- 始终考虑更改如何融入更大架构

## 性能与无障碍要求

### 性能优化
- 适当优化图像和资源
- 为出现在折叠下方的组件使用懒加载
- 在适当时使用动态导入实现适当的代码分割
- 通过避免不必要的依赖最小化包大小
- 优化后端操作中的数据库查询
- 在适当时使用记忆化技术 (useMemo, useCallback)

### 无障碍标准
- 实现适当的ARIA标签和属性
- 确保语义化HTML结构
- 维持键盘可导航性
- 遵循WCAG颜色对比指南
- 为图像提供替代文本
- 为交互元素使用焦点指示器
- 确保屏幕阅读器兼容性

## 参考与关键文件

### 配置文件
- `frontend/eslint.config.js` - 前端linting规则
- `frontend/.prettierrc.json` - 前端格式化规则
- `frontend/tsconfig.json` - TypeScript配置
- `frontend/tailwind.config.js` - Tailwind CSS主题和动画
- `backend/requirements.txt` - 后端依赖

### 文档
- `AGENTS.md` - AI助手的详细项目指南
- `README.md` - 项目概述和设置说明
- `frontend/README.md` - 前端特定文档
- `backend/README.md` - 后端特定文档

### 关键实现示例
- `frontend/src/components/ui/GlassCard.tsx` - 玻璃拟态组件实现
- `frontend/src/lib/utils.ts` - 工具函数 (cn函数)
- `backend/app/models/article.py` - SQLAlchemy模型示例
- `backend/app/schemas/article.py` - Pydantic模式示例
- `backend/app/api/v1/endpoints/articles.py` - FastAPI端点模式
- `frontend/src/app/layout.tsx` - Next.js布局结构