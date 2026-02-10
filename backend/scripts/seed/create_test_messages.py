"""创建测试留言数据"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.message import Message
from app.models.user import User
from uuid import uuid4
import random


def get_or_create_test_user(db: Session, username: str) -> User:
    """获取或创建测试用户"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = User(
            username=username,
            email=f"{username}@test.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5z6J1K9W4E3",  # password: password
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


DANMAKU_COLORS = [
    '#00D9FF',
    '#FF6B9D',
    '#4ECDC4',
    '#FFE66D',
    '#FF6B6B',
    '#A855F7',
    '#FB923C',
    '#FFFFFF'
]

TEST_MESSAGES = [
    "欢迎来到我的博客！这里使用了 Glassmorphism 设计风格。",
    "React 18 的新特性真的很有用，特别是 Suspense 和 Concurrent Rendering。",
    "有人用过 Next.js 14 的 App Router 吗？感觉比 Pages Router 好用多了。",
    "前端性能优化很重要，useMemo 和 useCallback 要合理使用。",
    "TypeScript 类型检查能避免很多运行时错误，强烈推荐！",
    "Tailwind CSS 确实提高了开发效率，不用写重复的 CSS。",
    "数据库设计要考虑索引，不然查询会很慢。",
    "WebSocket 实时通信让用户体验更好！",
    "UI/UX 设计要考虑无障碍访问，a11y 很重要。",
    "后端用 FastAPI 开发效率很高，API 文档自动生成很方便。",
    "PostgreSQL 的 JSON 类型很灵活，适合半结构化数据。",
    "Docker 容器化部署真的省事，环境一致性好。",
    "CI/CD 自动化部署能减少人为错误。",
    "代码审查是保证代码质量的重要环节。",
    "单元测试能提前发现很多 bug，要养成写测试的习惯。",
    "Redis 缓存能显著提升性能，特别是读多写少的场景。",
    "OAuth 2.0 认证流程要理解清楚，security 关键。",
    "RESTful API 设计要遵循规范，命名要清晰。",
    "前端状态管理，Context API 对于小项目就够用了。",
    "CSS Grid 布局比 Flexbox 更适合二维布局。",
]

TEST_DANMAKU = [
    "666！",
    "博主真棒！",
    "学到了",
    "感谢分享",
    "收藏了",
    "前排围观",
    "沙发！",
    "打卡",
    "太强了",
    "继续加油",
]


def create_test_messages():
    """创建测试留言数据"""
    db = SessionLocal()
    
    try:
        print("开始创建测试留言...")
        
        users = {
            'admin': get_or_create_test_user(db, 'admin'),
            'tech_guru': get_or_create_test_user(db, 'tech_guru'),
            'web_dev': get_or_create_test_user(db, 'web_dev'),
            'coder': get_or_create_test_user(db, 'coder'),
        }
        
        messages_count = 0
        danmaku_count = 0
        
        for i, content in enumerate(TEST_MESSAGES, 1):
            user = random.choice(list(users.values()))
            message = Message(
                content=content,
                color=random.choice(DANMAKU_COLORS),
                is_danmaku=i % 3 != 0,
                level=random.randint(1, 50),
                author_id=user.id
            )
            db.add(message)
            messages_count += 1
            if i % 3 != 0:
                danmaku_count += 1
        
        for i, content in enumerate(TEST_DANMAKU, 1):
            user = random.choice(list(users.values()))
            message = Message(
                content=content,
                color=random.choice(DANMAKU_COLORS),
                is_danmaku=True,
                level=random.randint(1, 30),
                author_id=user.id
            )
            db.add(message)
            danmaku_count += 1
        
        db.commit()
        
        total_count = db.query(Message).filter(Message.is_deleted == False).count()
        
        print(f"✅ 创建完成！")
        print(f"   - 普通留言: {messages_count} 条")
        print(f"   - 弹幕留言: {danmaku_count} 条")
        print(f"   - 数据库总留言数: {total_count} 条")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 创建失败: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_test_messages()
