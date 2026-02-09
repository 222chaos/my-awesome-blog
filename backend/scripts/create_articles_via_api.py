"""
通过API接口创建文章
"""
import sys
from pathlib import Path
import requests
from datetime import datetime
import json

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

BASE_URL = "http://127.0.0.1:8989/api/v1"


def login(username: str, password: str) -> str:
    """
    登录获取 access_token
    
    Args:
        username: 用户名
        password: 密码
    
    Returns:
        access_token
    """
    url = f"{BASE_URL}/auth/login-json"
    payload = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        token_data = response.json()
        print(f"✓ 登录成功")
        return token_data["access_token"]
    except requests.exceptions.RequestException as e:
        print(f"✗ 登录失败: {e}")
        if response:
            print(f"  响应: {response.text}")
        sys.exit(1)


def create_article(token: str, article_data: dict) -> dict:
    """
    创建文章
    
    Args:
        token: access_token
        article_data: 文章数据
    
    Returns:
        创建的文章数据
    """
    url = f"{BASE_URL}/articles/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=article_data, headers=headers)
        response.raise_for_status()
        result = response.json()
        print(f"✓ 文章创建成功: {article_data['title']}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"✗ 文章创建失败: {article_data['title']}")
        print(f"  错误: {e}")
        if response:
            print(f"  响应: {response.text}")
        return None


def get_articles(token: str) -> list:
    """
    获取所有文章列表
    
    Args:
        token: access_token
    
    Returns:
        文章列表
    """
    url = f"{BASE_URL}/articles/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"✗ 获取文章列表失败: {e}")
        return []


def main():
    """主函数"""
    print("=" * 60)
    print("通过API接口创建文章")
    print("=" * 60)
    
    articles_data = [
        {
            "title": "FastAPI异步编程完全指南",
            "slug": "fastapi-async-programming-guide",
            "content": """FastAPI提供了强大的异步编程支持，本文深入讲解异步编程的原理和实践。

## 异步编程基础

FastAPI基于Starlette和Pydantic构建，原生支持异步编程。异步编程可以提高应用的并发处理能力，特别是在I/O密集型任务中。

## async/await 语法

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
```

## 异步数据库操作

使用异步ORM如SQLAlchemy 2.0的async支持：

```python
from sqlalchemy.ext.asyncio import AsyncSession

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

## 最佳实践

1. 合理使用异步操作，避免不必要的async
2. 使用连接池管理数据库连接
3. 正确处理异常和资源清理
4. 使用异步中间件处理请求
""",
            "excerpt": "深入理解FastAPI的异步编程，提升应用性能",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        },
        {
            "title": "React Server Components深度解析",
            "slug": "react-server-components-deep-dive",
            "content": """React Server Components是React 18引入的新特性，改变了前端开发的范式。

## 什么是Server Components

Server Components在服务器端渲染，可以访问数据库和后端服务，直接在服务器上构建UI。

## 核心优势

1. **零客户端JS**: 减少需要发送到浏览器的JavaScript代码
2. **直接访问后端**: 可以在组件中直接查询数据库
3. **更小的bundle**: 客户端只需要加载必要的交互组件
4. **更好的性能**: 减少网络请求和客户端渲染负担

## 使用示例

```jsx
async function UserProfile({ userId }) {
  const user = await db.user.findUnique({ 
    where: { id: userId } 
  });
  
  return <div>{user.name}</div>;
}
```

## 混合使用

Server Components和Client Components可以混合使用：

```jsx
export default function Page() {
  return (
    <>
      <ServerComponent />
      <ClientComponent />
    </>
  );
}
```
""",
            "excerpt": "React Server Components改变前端开发范式",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        },
        {
            "title": "PostgreSQL全文搜索实战",
            "slug": "postgresql-fulltext-search",
            "content": """PostgreSQL提供了强大的全文搜索功能，无需依赖外部搜索引擎。

## 全文搜索基础

PostgreSQL的全文搜索基于tsvector数据类型和GiST/GiN索引。

## 基本用法

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector TSVECTOR
);

CREATE INDEX idx_search ON articles USING GIN(search_vector);
```

## 中文搜索支持

使用zhparser分词插件：

```sql
CREATE EXTENSION zhparser;

SELECT to_tsvector('zhparser', '中文全文搜索功能');
```

## 查询优化

```sql
SELECT title, content
FROM articles
WHERE search_vector @@ plainto_tsquery('zhparser', '数据库 优化')
ORDER BY ts_rank(search_vector, plainto_tsquery('zhparser', '数据库 优化')) DESC;
```

## 高级技巧

1. 使用ts_headline生成高亮摘要
2. 配合rank函数排序结果相关性
3. 使用phrase搜索精确匹配短语
4. 合理配置权重字段
""",
            "excerpt": "PostgreSQL内置的全文搜索功能完全够用",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        },
        {
            "title": "Docker多阶段构建优化镜像",
            "slug": "docker-multi-stage-build-optimization",
            "content": """Docker多阶段构建可以显著减小镜像大小，提升部署效率。

## 什么是多阶段构建

多阶段构建允许在一个Dockerfile中使用多个FROM指令，每个FROM开始一个新的构建阶段。

## 基础示例

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "server.js"]
```

## 优化技巧

1. **使用alpine镜像**: 基于Alpine Linux的镜像更小
2. **清理缓存**: 删除npm缓存和临时文件
3. **合并RUN指令**: 减少镜像层数
4. **利用构建缓存**: 合理安排COPY和RUN顺序
5. **多平台构建**: 使用docker buildx支持多架构

## 实战案例

Python应用优化：

```dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```
""",
            "excerpt": "通过多阶段构建显著减小Docker镜像体积",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        },
        {
            "title": "AI大模型应用开发实战",
            "slug": "ai-llm-application-development",
            "content": """AI大模型正在改变软件开发的方式，本文分享应用开发实践经验。

## 技术选型

### API提供商
- OpenAI: GPT系列模型，质量最高
- Anthropic: Claude系列，擅长长文本
- 本地模型: Llama, Mistral等

### 开发框架
- LangChain: 最流行的LLM应用框架
- Semantic Kernel: 微软的LLM编排框架
- AutoGPT: 自主Agent框架

## 核心模式

### 1. 提示工程

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个专业的代码助手"},
        {"role": "user", "content": "帮我写一个Python函数"}
    ]
)
```

### 2. RAG检索增强

将LLM与知识库结合：

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Chroma.from_documents(
    documents,
    OpenAIEmbeddings()
)
```

### 3. Agent自主决策

让AI自主规划任务并执行：

```python
from langchain.agents import initialize_agent, Tool

tools = [
    Tool(name="Search", func=search_tool, description="搜索信息"),
    Tool(name="Calculator", func=calculator, description="计算")
]

agent = initialize_agent(
    tools, llm, agent="zero-shot-react-description"
)
```

## 实践建议

1. **成本控制**: 合理设置token限制和缓存策略
2. **质量保证**: 实现结果验证和人工审核
3. **安全考虑**: 过滤敏感信息，设置内容边界
4. **性能优化**: 使用流式响应和异步调用
5. **持续迭代**: 根据用户反馈优化提示词
""",
            "excerpt": "AI大模型应用开发的完整指南",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        },
        {
            "title": "TypeScript高级类型编程",
            "slug": "typescript-advanced-type-programming",
            "content": """TypeScript的高级类型功能可以让代码更安全、更灵活。

## 泛型约束

使用extends约束泛型类型：

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}
```

## 条件类型

根据条件选择类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null>; // string
```

## 映射类型

遍历和转换对象类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## 模板字面量类型

从字符串模板推断类型：

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>; // 'onClick'
```

## 递归类型

处理嵌套数据结构：

```typescript
type Json = string | number | boolean | null | 
  Json[] | { [key: string]: Json };
```

## 类型守卫和谓词

运行时类型检查：

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```
""",
            "excerpt": "掌握TypeScript的高级类型系统",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True
        }
    ]
    
    try:
        print(f"\n1. 登录获取Token...")
        token = login("admin", "admin123")
        
        print(f"\n2. 检查现有文章...")
        existing_articles = get_articles(token)
        existing_slugs = {article.get('slug') for article in existing_articles}
        print(f"   现有 {len(existing_articles)} 篇文章")
        
        print(f"\n3. 创建新文章...")
        created_count = 0
        skipped_count = 0
        
        for article_data in articles_data:
            if article_data['slug'] in existing_slugs:
                print(f"⊘ 跳过已存在的文章: {article_data['title']}")
                skipped_count += 1
                continue
            
            result = create_article(token, article_data)
            if result:
                created_count += 1
        
        print(f"\n" + "=" * 60)
        print(f"操作完成！")
        print(f"  创建: {created_count} 篇")
        print(f"  跳过: {skipped_count} 篇")
        print(f"  总计: {len(articles_data)} 篇")
        print("=" * 60)
        
    except KeyboardInterrupt:
        print("\n\n操作被用户中断")
        sys.exit(0)


if __name__ == "__main__":
    main()
