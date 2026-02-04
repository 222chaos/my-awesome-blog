"""
测试数据种子脚本
用于生成丰富的测试数据以测试各个API接口和页面展示效果
"""
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app import crud
from app.schemas.user import UserCreate
from app.schemas.category import CategoryCreate
from app.schemas.tag import TagCreate
from app.schemas.comment import CommentCreate
from app.schemas.message import MessageCreate
from app.schemas.friend_link import FriendLinkCreate
from app.schemas.subscription import SubscriptionCreate
from app.schemas.timeline_event import TimelineEventCreate
from app.schemas.typewriter_content import TypewriterContentCreate
from app.schemas.portfolio import PortfolioCreate, PortfolioItemCreate
from app.schemas.article import ArticleCreate
from app.utils.logger import app_logger
from datetime import datetime, timedelta
import uuid
from app.models.article_tag import ArticleTag
from app.models.article_category import ArticleCategory
from app.models.subscription import Subscription


def seed_users(db: Session) -> None:
    """创建测试用户"""
    users_data = [
        {
            "username": "admin",
            "email": "admin@example.com",
            "password": "admin123",
            "full_name": "管理员",
            "is_active": True,
            "is_superuser": True,
            "bio": "这是博客管理员",
            "website": "https://example.com",
            "github": "admin_github",
            "twitter": "admin_twitter"
        },
        {
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "test123",
            "full_name": "测试用户一",
            "is_active": True,
            "bio": "热爱编程的工程师",
            "website": "https://testuser1.dev"
        },
        {
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "test123",
            "full_name": "测试用户二",
            "is_active": True,
            "bio": "全栈开发者"
        },
        {
            "username": "xiaoming",
            "email": "xiaoming@example.com",
            "password": "test123",
            "full_name": "小明",
            "is_active": True,
            "bio": "前端爱好者"
        },
        {
            "username": "daxiong",
            "email": "daxiong@example.com",
            "password": "test123",
            "full_name": "大熊",
            "is_active": True,
            "bio": "后端专家"
        }
    ]
    
    users = []
    for user_data in users_data:
        existing_user = crud.get_user_by_username(db, username=user_data["username"])
        if not existing_user:
            user_create = UserCreate(**user_data)
            user = crud.create_user(db, user_create)
            users.append(user)
            app_logger.info(f"创建用户: {user.username}")
        else:
            users.append(existing_user)
    
    return users


def seed_categories_and_tags(db: Session) -> tuple:
    """创建分类和标签"""
    categories_data = [
        {"name": "Python", "slug": "python", "description": "Python编程相关文章"},
        {"name": "前端开发", "slug": "frontend", "description": "前端开发技术"},
        {"name": "后端开发", "slug": "backend", "description": "后端开发技术"},
        {"name": "DevOps", "slug": "devops", "description": "DevOps相关内容"},
        {"name": "数据库", "slug": "database", "description": "数据库技术"},
        {"name": "人工智能", "slug": "ai", "description": "人工智能相关"},
        {"name": "生活随笔", "slug": "life", "description": "生活感悟"}
    ]
    
    categories = []
    for cat_data in categories_data:
        existing_cat = crud.get_category_by_name(db, name=cat_data["name"])
        if not existing_cat:
            cat_create = CategoryCreate(**cat_data)
            cat = crud.create_category(db, cat_create)
            categories.append(cat)
            app_logger.info(f"创建分类: {cat.name}")
        else:
            categories.append(existing_cat)
    
    tags_data = [
        {"name": "FastAPI", "slug": "fastapi", "description": "FastAPI框架"},
        {"name": "React", "slug": "react", "description": "React框架"},
        {"name": "Vue.js", "slug": "vuejs", "description": "Vue.js框架"},
        {"name": "PostgreSQL", "slug": "postgresql", "description": "PostgreSQL数据库"},
        {"name": "Docker", "slug": "docker", "description": "Docker容器"},
        {"name": "Kubernetes", "slug": "kubernetes", "description": "Kubernetes编排"},
        {"name": "TypeScript", "slug": "typescript", "description": "TypeScript语言"},
        {"name": "Node.js", "slug": "nodejs", "description": "Node.js运行时"},
        {"name": "Redis", "slug": "redis", "description": "Redis缓存"},
        {"name": "Next.js", "slug": "nextjs", "description": "Next.js框架"}
    ]
    
    tags = []
    for tag_data in tags_data:
        existing_tag = crud.get_tag_by_name(db, name=tag_data["name"])
        if not existing_tag:
            tag_create = TagCreate(**tag_data)
            tag = crud.create_tag(db, tag_create)
            tags.append(tag)
            app_logger.info(f"创建标签: {tag.name}")
        else:
            tags.append(existing_tag)
    
    return categories, tags


def seed_articles(db: Session, users: list, categories: list, tags: list) -> list:
    """创建测试文章"""
    admin_user = users[0]
    
    articles_data = [
        {
            "title": "FastAPI快速入门指南",
            "slug": "fastapi-quick-start",
            "content": """FastAPI是一个现代、快速（高性能）的Web框架，用于基于标准Python类型提示使用Python 3.6+构建API。

## 主要特点

- **快速**: 与NodeJS和Go相当的高性能
- **快速编码**: 将开发功能的速度提高约200％至300％
- **更少的bug**: 减少约40％的开发错误
- **直观**: 强大的编辑器支持，到处都能自动补全
- **简单**: 设计易于使用和学习
- **标准**: 基于并完全兼容API的开放标准
""",
            "excerpt": "FastAPI是一个现代、快速的Web框架，本文带你快速入门",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "is_featured": True,
            "is_pinned": True,
            "read_time": 15,
            "published_at": datetime.now() - timedelta(days=30),
            "category_id": str(categories[0].id),
            "tag_ids": [str(tags[0].id)],
            "view_count": 1250
        },
        {
            "title": "React Hooks深入解析",
            "slug": "react-hooks-deep-dive",
            "content": """React Hooks 是React 16.8引入的新特性，它让你无需编写类组件就能使用state和其他React特性。

## 常用Hooks

- useState: 在函数组件中添加state
- useEffect: 在函数组件中处理副作用
- useContext: 在函数组件中订阅React context
- useReducer: 管理复杂组件的state
- useCallback: 缓存回调函数
- useMemo: 缓存计算结果
""",
            "excerpt": "深入了解React Hooks的使用方法和最佳实践",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "is_featured": True,
            "read_time": 20,
            "published_at": datetime.now() - timedelta(days=25),
            "category_id": str(categories[1].id),
            "tag_ids": [str(tags[1].id), str(tags[6].id)],
            "view_count": 890
        },
        {
            "title": "PostgreSQL性能优化实战",
            "slug": "postgresql-performance-optimization",
            "content": """PostgreSQL是一个强大的开源关系型数据库，本文将介绍多种性能优化技巧。

## 索引优化

1. 合理创建索引
2. 使用部分索引
3. 考虑使用BRIN索引
4. 定期维护索引

## 查询优化

1. 使用EXPLAIN分析查询计划
2. 避免N+1查询问题
3. 合理使用连接查询
4. 使用CTE优化复杂查询
""",
            "excerpt": "分享PostgreSQL数据库性能优化的实战经验",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "read_time": 25,
            "published_at": datetime.now() - timedelta(days=20),
            "category_id": str(categories[4].id),
            "tag_ids": [str(tags[3].id)],
            "view_count": 1560
        },
        {
            "title": "Docker容器化部署最佳实践",
            "slug": "docker-deployment-best-practices",
            "content": """Docker已成为现代应用部署的标准工具，本文分享最佳实践。

## 镜像优化

1. 使用多阶段构建
2. 选择合适的基础镜像
3. 清理不必要的文件
4. 利用缓存层

## 容器编排

1. Docker Compose本地开发
2. Kubernetes生产部署
3. 健康检查配置
4. 资源限制设置
""",
            "excerpt": "Docker容器化部署的最佳实践分享",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "is_featured": True,
            "read_time": 18,
            "published_at": datetime.now() - timedelta(days=15),
            "category_id": str(categories[3].id),
            "tag_ids": [str(tags[4].id), str(tags[5].id)],
            "view_count": 2100
        },
        {
            "title": "TypeScript类型系统完全指南",
            "slug": "typescript-type-system-guide",
            "content": """TypeScript是JavaScript的超集，添加了静态类型定义。

## 基础类型

- string
- number
- boolean
- array
- tuple
- enum
- any
- void

## 高级类型

- 联合类型
- 交叉类型
- 泛型
- 条件类型
- 映射类型
""",
            "excerpt": "TypeScript类型系统的完全指南",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "read_time": 30,
            "published_at": datetime.now() - timedelta(days=12),
            "category_id": str(categories[1].id),
            "tag_ids": [str(tags[6].id)],
            "view_count": 1780
        },
        {
            "title": "Redis缓存架构设计",
            "slug": "redis-cache-architecture",
            "content": """Redis是一个高性能的键值存储系统，常用于缓存、会话存储和消息队列。

## 数据结构

- String: 字符串、整数、浮点数
- Hash: 键值对集合
- List: 链表
- Set: 无序集合
- Sorted Set: 有序集合

## 应用场景

1. 缓存热点数据
2. 计数器和排行榜
3. 分布式锁
4. 消息队列
""",
            "excerpt": "深入理解Redis缓存架构设计",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "read_time": 22,
            "published_at": datetime.now() - timedelta(days=10),
            "category_id": str(categories[4].id),
            "tag_ids": [str(tags[8].id)],
            "view_count": 1340
        },
        {
            "title": "Vue3 Composition API实战",
            "slug": "vue3-composition-api",
            "content": """Vue3引入了Composition API，提供更灵活的代码组织方式。

## setup函数

setup是Composition API的入口点，在组件创建之前执行。

## 响应式API

- ref: 创建响应式引用
- reactive: 创建响应式对象
- computed: 创建计算属性
- watch: 监听响应式数据变化
""",
            "excerpt": "Vue3 Composition API实战教程",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "is_featured": True,
            "read_time": 16,
            "published_at": datetime.now() - timedelta(days=8),
            "category_id": str(categories[1].id),
            "tag_ids": [str(tags[2].id)],
            "view_count": 950
        },
        {
            "title": "Kubernetes生产环境部署指南",
            "slug": "kubernetes-production-deployment",
            "content": """Kubernetes是容器编排的事实标准，本文介绍生产环境部署经验。

## 部署清单

1. 资源请求和限制
2. 健康检查和就绪检查
3. 滚动更新策略
4. 自动扩缩容配置
5. 持久化存储配置

## 监控和日志

1. Prometheus指标收集
2. Grafana可视化
3. ELK日志聚合
""",
            "excerpt": "Kubernetes生产环境部署完整指南",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "read_time": 28,
            "published_at": datetime.now() - timedelta(days=6),
            "category_id": str(categories[3].id),
            "tag_ids": [str(tags[5].id), str(tags[4].id)],
            "view_count": 1680
        },
        {
            "title": "AI辅助编程实践",
            "slug": "ai-assisted-programming",
            "content": """人工智能正在改变软件开发的方式，本文分享AI辅助编程的实践经验。

## AI工具

1. GitHub Copilot: 代码自动补全
2. ChatGPT: 技术问答和代码生成
3. Claude: 代码审查和优化建议

## 最佳实践

1. 理解生成的代码
2. 保持代码审查习惯
3. 结合领域知识
4. 迭代优化
""",
            "excerpt": "AI辅助编程的实践经验分享",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "is_pinned": True,
            "read_time": 12,
            "published_at": datetime.now() - timedelta(days=4),
            "category_id": str(categories[5].id),
            "tag_ids": [],
            "view_count": 2450
        },
        {
            "title": "Next.js服务端渲染实战",
            "slug": "nextjs-ssr-guide",
            "content": """Next.js提供了强大的服务端渲染能力，本文深入讲解SSR。

## SSR优势

1. SEO优化
2. 首屏加载快
3. 社交媒体分享优化

## 实现方式

1. getServerSideProps
2. getStaticProps
3. getInitialProps
4. App Router的Server Components
""",
            "excerpt": "Next.js服务端渲染完整指南",
            "cover_image": "https://via.placeholder.com/800x400",
            "is_published": True,
            "read_time": 24,
            "published_at": datetime.now() - timedelta(days=2),
            "category_id": str(categories[1].id),
            "tag_ids": [str(tags[1].id), str(tags[9].id)],
            "view_count": 1120
        },
        {
            "title": "Node.js异步编程深度解析",
            "slug": "nodejs-async-programming",
            "content": """Node.js的异步编程是其核心特性，本文深入解析。

## 事件循环

Node.js使用事件循环处理异步操作。

## 异步模式

1. 回调函数
2. Promise
3. async/await
4. 事件发射器
""",
            "excerpt": "Node.js异步编程深度解析",
            "is_published": False,
            "read_time": 20,
            "published_at": None,
            "category_id": str(categories[2].id),
            "tag_ids": [str(tags[7].id)],
            "view_count": 0
        }
    ]
    
    articles = []
    for article_data in articles_data:
        existing_article = crud.get_article_by_slug(db, slug=article_data["slug"])
        if not existing_article:
            article_create = ArticleCreate(
                **{k: v for k, v in article_data.items() if k not in ["tag_ids", "category_id", "author_id"]}
            )
            article = crud.create_article(db, article_create, author_id=admin_user.id)
            
            # 关联标签
            if article_data.get("tag_ids"):
                from app.models.tag import Tag
                for tag_id in article_data["tag_ids"]:
                    tag = db.query(Tag).filter(Tag.id == tag_id).first()
                    if tag:
                        article_tag = ArticleTag(article_id=article.id, tag_id=tag.id)
                        db.add(article_tag)
            
            # 关联分类
            if article_data.get("category_id"):
                from app.models.category import Category
                category = db.query(Category).filter(Category.id == article_data["category_id"]).first()
                if category:
                    article_category = ArticleCategory(article_id=article.id, category_id=category.id, is_primary=True)
                    db.add(article_category)
            
            db.commit()
            articles.append(article)
            app_logger.info(f"创建文章: {article.title}")
        else:
            articles.append(existing_article)
    
    return articles


def seed_comments(db: Session, users: list, articles: list) -> None:
    """创建测试评论"""
    comments_data = [
        {
            "content": "这篇文章写得太好了！非常有帮助",
            "article_id": str(articles[0].id),
            "is_approved": True
        },
        {
            "content": "感谢分享，学到了很多",
            "article_id": str(articles[0].id),
            "is_approved": True
        },
        {
            "content": "有个问题想请教，setup函数的执行时机是什么？",
            "article_id": str(articles[1].id),
            "is_approved": True
        },
        {
            "content": "非常好的教程，期待更多内容",
            "article_id": str(articles[1].id),
            "is_approved": True
        },
        {
            "content": "PostgreSQL确实很强大，我也在生产环境使用",
            "article_id": str(articles[2].id),
            "is_approved": True
        },
        {
            "content": "Docker多阶段构建确实很有用，节省了很多空间",
            "article_id": str(articles[3].id),
            "is_approved": True
        },
        {
            "content": "TypeScript的类型系统确实强大，推荐大家使用",
            "article_id": str(articles[4].id),
            "is_approved": True
        },
        {
            "content": "Redis的Sorted Set太有用了，做排行榜很方便",
            "article_id": str(articles[5].id),
            "is_approved": True
        },
        {
            "content": "Vue3的Composition API比Options API更灵活",
            "article_id": str(articles[6].id),
            "is_approved": True
        },
        {
            "content": "K8s确实复杂但很强大，这篇文章总结得很好",
            "article_id": str(articles[7].id),
            "is_approved": True
        },
        {
            "content": "AI辅助编程确实提高了效率",
            "article_id": str(articles[8].id),
            "is_approved": True
        },
        {
            "content": "Next.js的SSR对SEO真的很重要",
            "article_id": str(articles[9].id),
            "is_approved": True
        },
        {
            "content": "等待审核的评论",
            "article_id": str(articles[0].id),
            "is_approved": False
        }
    ]
    
    for i, comment_data in enumerate(comments_data):
        existing_comments = crud.get_comments_by_article(db, article_id=comment_data["article_id"])
        if not any(c.content == comment_data["content"] for c in existing_comments):
            comment_create = CommentCreate(**comment_data)
            author_id = users[i % len(users)].id
            comment = crud.create_comment(db, comment_create, author_id=author_id)
            app_logger.info(f"创建评论: {comment.content[:30]}...")


def seed_messages(db: Session, users: list) -> None:
    """创建测试留言"""
    messages_data = [
        {
            "content": "欢迎来到我的博客！",
            "is_danmaku": True
        },
        {
            "content": "博客做得真不错！",
            "is_danmaku": True
        },
        {
            "content": "期待更多好文章",
            "is_danmaku": False
        },
        {
            "content": "设计很漂亮",
            "is_danmaku": True
        },
        {
            "content": "学到了很多知识",
            "is_danmaku": False
        },
        {
            "content": "技术栈选得很合理",
            "is_danmaku": True
        },
        {
            "content": "界面交互很流畅",
            "is_danmaku": False
        },
        {
            "content": "继续加油！",
            "is_danmaku": True
        },
        {
            "content": "文章质量很高",
            "is_danmaku": False
        },
        {
            "content": "期待更多分享",
            "is_danmaku": True
        },
        {
            "content": "FastAPI确实很强大",
            "is_danmaku": False
        },
        {
            "content": "React Hooks用起来很舒服",
            "is_danmaku": True
        },
        {
            "content": "数据库优化很有价值",
            "is_danmaku": False
        },
        {
            "content": "容器化部署很有必要",
            "is_danmaku": True
        },
        {
            "content": "TypeScript类型系统很棒",
            "is_danmaku": False
        },
        {
            "content": "Redis缓存很重要",
            "is_danmaku": True
        },
        {
            "content": "Vue3确实比Vue2好用",
            "is_danmaku": False
        }
    ]
    
    for msg_data in messages_data:
        existing_messages = crud.get_messages(db)
        if not any(m.content == msg_data["content"] for m in existing_messages):
            msg_create = MessageCreate(**msg_data)
            author_id = users[len(existing_messages) % len(users)].id
            msg = crud.create_message(db, msg_create, author_id=author_id)
            app_logger.info(f"创建留言: {msg.content[:30]}...")


def seed_friend_links(db: Session) -> None:
    """创建友情链接"""
    friend_links_data = [
        {
            "name": "阮一峰的网络日志",
            "url": "https://www.ruanyifeng.com/blog/",
            "favicon": "https://www.ruanyifeng.com/favicon.ico",
            "description": "知名技术博客，分享前端和编程知识",
            "sort_order": 1,
            "is_active": True,
            "is_featured": True
        },
        {
            "name": "廖雪峰的官方网站",
            "url": "https://www.liaoxuefeng.com/",
            "favicon": "https://www.liaoxuefeng.com/favicon.ico",
            "description": "提供优质的编程教程",
            "sort_order": 2,
            "is_active": True,
            "is_featured": True
        },
        {
            "name": "张鑫旭的博客",
            "url": "https://www.zhangxinxu.com/",
            "favicon": "https://www.zhangxinxu.com/favicon.ico",
            "description": "专注于前端技术分享",
            "sort_order": 3,
            "is_active": True,
            "is_featured": True
        },
        {
            "name": "掘金技术社区",
            "url": "https://juejin.cn/",
            "favicon": "https://juejin.cn/favicon.ico",
            "description": "帮助开发者成长的社区",
            "sort_order": 4,
            "is_active": True,
            "is_featured": False
        },
        {
            "name": "知乎",
            "url": "https://www.zhihu.com/",
            "favicon": "https://static.zhihu.com/heifetz/favicon.ico",
            "description": "有问题，就会有答案",
            "sort_order": 5,
            "is_active": True,
            "is_featured": False
        },
        {
            "name": "V2EX",
            "url": "https://www.v2ex.com/",
            "favicon": "https://www.v2ex.com/static/favicon.ico",
            "description": "创意工作者们的社区",
            "sort_order": 6,
            "is_active": True,
            "is_featured": False
        },
        {
            "name": "GitHub",
            "url": "https://github.com/",
            "favicon": "https://github.githubassets.com/favicons/favicon.svg",
            "description": "全球最大的代码托管平台",
            "sort_order": 7,
            "is_active": True,
            "is_featured": True
        },
        {
            "name": "Stack Overflow",
            "url": "https://stackoverflow.com/",
            "favicon": "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico",
            "description": "全球最大的程序员问答社区",
            "sort_order": 8,
            "is_active": True,
            "is_featured": False
        },
        {
            "name": "MDN Web Docs",
            "url": "https://developer.mozilla.org/",
            "favicon": "https://developer.mozilla.org/static/img/favicon32.png",
            "description": "Web开发者的权威文档",
            "sort_order": 9,
            "is_active": True,
            "is_featured": False
        },
        {
            "name": "Vue.js官方文档",
            "url": "https://vuejs.org/",
            "favicon": "https://vuejs.org/logo.svg",
            "description": "渐进式JavaScript框架",
            "sort_order": 10,
            "is_active": True,
            "is_featured": True
        }
    ]
    
    existing_links = crud.get_friend_links(db)
    existing_names = {link.name for link in existing_links}
    
    for link_data in friend_links_data:
        if link_data["name"] not in existing_names:
            link_create = FriendLinkCreate(**link_data)
            link = crud.create_friend_link(db, link_create)
            app_logger.info(f"创建友链: {link.name}")


def seed_subscriptions(db: Session) -> None:
    """创建订阅数据"""
    subscriptions_data = [
        {"email": "user1@example.com", "is_active": True, "is_verified": True},
        {"email": "user2@example.com", "is_active": True, "is_verified": True},
        {"email": "user3@example.com", "is_active": True, "is_verified": True},
        {"email": "user4@example.com", "is_active": True, "is_verified": True},
        {"email": "user5@example.com", "is_active": True, "is_verified": True},
        {"email": "user6@example.com", "is_active": True, "is_verified": True},
        {"email": "user7@example.com", "is_active": True, "is_verified": False},
        {"email": "user8@example.com", "is_active": True, "is_verified": True},
        {"email": "user9@example.com", "is_active": True, "is_verified": True},
        {"email": "user10@example.com", "is_active": True, "is_verified": True},
        {"email": "user11@example.com", "is_active": True, "is_verified": True},
        {"email": "user12@example.com", "is_active": False, "is_verified": True},
        {"email": "user13@example.com", "is_active": True, "is_verified": True},
        {"email": "user14@example.com", "is_active": True, "is_verified": False},
        {"email": "user15@example.com", "is_active": True, "is_verified": True},
        {"email": "user16@example.com", "is_active": True, "is_verified": True},
        {"email": "user17@example.com", "is_active": False, "is_verified": True},
        {"email": "user18@example.com", "is_active": True, "is_verified": True}
    ]
    
    for sub_data in subscriptions_data:
        existing_sub = db.query(Subscription).filter(
            Subscription.email == sub_data["email"]
        ).first()
        if not existing_sub:
            sub_create = SubscriptionCreate(**sub_data)
            sub = crud.create_subscription(db, sub_create)
            app_logger.info(f"创建订阅: {sub.email}")


def seed_timeline_events(db: Session) -> None:
    """创建时间轴事件"""
    timeline_events_data = [
        {
            "title": "开始技术博客之旅",
            "description": "创建个人技术博客，开始系统性地记录学习和成长历程",
            "event_date": "2024-03-15",
            "event_type": "milestone",
            "icon": "🚀",
            "color": "#10B981",
            "is_active": True,
            "sort_order": 10
        },
        {
            "title": "发布第一个开源项目",
            "description": "正式发布第一个开源项目，为开发者提供实用的工具库",
            "event_date": "2024-06-20",
            "event_type": "project",
            "icon": "📦",
            "color": "#06B6D4",
            "is_active": True,
            "sort_order": 9
        },
        {
            "title": "技术文章被平台推荐",
            "description": "多篇技术文章被掘金、知乎等平台推荐，累计阅读量超过10万",
            "event_date": "2024-08-10",
            "event_type": "award",
            "icon": "🏆",
            "color": "#EF4444",
            "is_active": True,
            "sort_order": 8
        },
        {
            "title": "开源项目获得500+ Star",
            "description": "个人开源项目在GitHub上获得超过500个Star，感谢社区的支持",
            "event_date": "2024-10-05",
            "event_type": "achievement",
            "icon": "⭐",
            "color": "#F59E0B",
            "is_active": True,
            "sort_order": 7
        },
        {
            "title": "完成100篇技术博客",
            "description": "坚持写作100篇技术博客，分享前端、后端和DevOps相关的知识和经验",
            "event_date": "2024-12-01",
            "event_type": "milestone",
            "icon": "📝",
            "color": "#8B5CF6",
            "is_active": True,
            "sort_order": 6
        },
        {
            "title": "学习FastAPI框架",
            "description": "深入学习FastAPI框架，并用于实际项目开发",
            "event_date": "2024-04-01",
            "event_type": "achievement",
            "icon": "⚡",
            "color": "#14B8A6",
            "is_active": True,
            "sort_order": 5
        },
        {
            "title": "掌握React Hooks",
            "description": "熟练掌握React Hooks的使用，重构了多个组件",
            "event_date": "2024-05-15",
            "event_type": "achievement",
            "icon": "⚛️",
            "color": "#6366F1",
            "is_active": True,
            "sort_order": 4
        },
        {
            "title": "优化PostgreSQL数据库",
            "description": "对生产环境的PostgreSQL数据库进行深度优化，性能提升50%",
            "event_date": "2024-07-20",
            "event_type": "achievement",
            "icon": "🗄️",
            "color": "#0EA5E9",
            "is_active": True,
            "sort_order": 3
        },
        {
            "title": "搭建Docker容器化环境",
            "description": "完成全栈应用的Docker容器化部署",
            "event_date": "2024-09-01",
            "event_type": "project",
            "icon": "🐳",
            "color": "#0284C7",
            "is_active": True,
            "sort_order": 2
        },
        {
            "title": "开始AI辅助编程实践",
            "description": "探索并实践AI辅助编程，提升开发效率",
            "event_date": "2024-11-15",
            "event_type": "milestone",
            "icon": "🤖",
            "color": "#8B5CF6",
            "is_active": True,
            "sort_order": 1
        }
    ]
    
    for event_data in timeline_events_data:
        existing_events = crud.get_timeline_events(db)
        if not any(e.title == event_data["title"] for e in existing_events):
            event_create = TimelineEventCreate(**event_data)
            event = crud.create_timeline_event(db, event_create)
            app_logger.info(f"创建时间轴事件: {event.title}")


def seed_typewriter_contents(db: Session) -> None:
    """创建打字机内容"""
    typewriter_contents_data = [
        {"text": "欢迎来到我的博客", "priority": 1, "is_active": True},
        {"text": "记录技术成长与生活点滴", "priority": 2, "is_active": True},
        {"text": "探索无限可能", "priority": 3, "is_active": True},
        {"text": "分享知识，传递价值", "priority": 4, "is_active": True},
        {"text": "代码改变世界", "priority": 5, "is_active": True},
        {"text": "持续学习，不断进步", "priority": 6, "is_active": True},
        {"text": "热爱技术，享受编程", "priority": 7, "is_active": True},
        {"text": "与社区共同成长", "priority": 8, "is_active": True}
    ]
    
    existing = crud.get_active_typewriter_contents(db)
    if not existing:
        for content_data in typewriter_contents_data:
            content_create = TypewriterContentCreate(**content_data)
            content = crud.create_typewriter_content(db, content_create)
            app_logger.info(f"创建打字机内容: {content.text}")


def seed_portfolios(db: Session, admin_user) -> None:
    """创建作品集数据"""
    from app.models.portfolio import Portfolio
    
    portfolios_data = [
        {
            "title": "个人博客系统",
            "slug": "personal-blog",
            "description": "使用FastAPI + Next.js构建的个人博客系统，支持文章、评论、留言等功能",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/blog",
            "technologies": ["FastAPI", "Next.js", "PostgreSQL", "Redis"],
            "status": "completed",
            "is_featured": True,
            "sort_order": 1
        },
        {
            "title": "开源工具库",
            "slug": "open-source-utils",
            "description": "一系列实用的JavaScript/TypeScript工具函数库，包含日期处理、字符串操作、验证等功能",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/utils",
            "technologies": ["TypeScript", "JavaScript"],
            "status": "completed",
            "is_featured": True,
            "sort_order": 2
        },
        {
            "title": "React组件库",
            "slug": "react-ui-lib",
            "description": "基于React的UI组件库，提供高质量的通用组件",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/react-ui",
            "technologies": ["React", "TypeScript", "TailwindCSS"],
            "status": "completed",
            "is_featured": False,
            "sort_order": 3
        },
        {
            "title": "API监控平台",
            "slug": "api-monitor",
            "description": "用于监控API性能和状态的平台，支持告警和可视化",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/api-monitor",
            "technologies": ["FastAPI", "Vue.js", "ECharts"],
            "status": "completed",
            "is_featured": False,
            "sort_order": 4
        },
        {
            "title": "自动化部署工具",
            "slug": "deploy-tool",
            "description": "简化应用部署流程的自动化工具，支持多种云平台",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/deploy-tool",
            "technologies": ["Python", "Docker", "Kubernetes"],
            "status": "completed",
            "is_featured": True,
            "sort_order": 5
        },
        {
            "title": "数据可视化大屏",
            "slug": "data-visualization",
            "description": "企业级数据可视化大屏项目，使用ECharts和React开发",
            "cover_image": "https://via.placeholder.com/600x400",
            "demo_url": "https://example.com",
            "github_url": "https://github.com/username/data-viz",
            "technologies": ["React", "ECharts", "Node.js"],
            "status": "completed",
            "is_featured": False,
            "sort_order": 6
        }
    ]
    
    for portfolio_data in portfolios_data:
        existing = db.query(Portfolio).filter(
            Portfolio.title == portfolio_data["title"]
        ).first()
        if not existing:
            port_create = PortfolioCreate(**portfolio_data)
            portfolio = crud.create_portfolio(db, port_create)
            
            app_logger.info(f"创建作品集: {portfolio.title}")


def main():
    """主函数"""
    print("=" * 60)
    print("测试数据种子脚本")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        print("\n1. 创建用户...")
        users = seed_users(db)
        print(f"   创建了 {len(users)} 个用户")
        
        print("\n2. 创建分类和标签...")
        categories, tags = seed_categories_and_tags(db)
        print(f"   创建了 {len(categories)} 个分类")
        print(f"   创建了 {len(tags)} 个标签")
        
        print("\n3. 创建文章...")
        articles = seed_articles(db, users, categories, tags)
        print(f"   创建了 {len(articles)} 篇文章")
        
        print("\n4. 创建评论...")
        seed_comments(db, users, articles)
        print("   创建评论完成")
        
        print("\n5. 创建留言...")
        seed_messages(db, users)
        print("   创建留言完成")
        
        print("\n6. 创建友情链接...")
        seed_friend_links(db)
        print("   创建友情链接完成")
        
        print("\n7. 创建订阅...")
        seed_subscriptions(db)
        print("   创建订阅完成")
        
        print("\n8. 创建时间轴事件...")
        seed_timeline_events(db)
        print("   创建时间轴事件完成")
        
        print("\n9. 创建打字机内容...")
        seed_typewriter_contents(db)
        print("   创建打字机内容完成")
        
        print("\n10. 创建作品集...")
        seed_portfolios(db, users[0])
        print("   创建作品集完成")
        
        db.commit()
        print("\n" + "=" * 60)
        print("测试数据创建完成！")
        print("=" * 60)
        print("\n测试账号:")
        print("  管理员: admin / admin123")
        print("  普通用户: testuser1 / test123")
        print("  普通用户: testuser2 / test123")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        app_logger.error(f"创建测试数据时出错: {e}")
        print(f"\n错误: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
