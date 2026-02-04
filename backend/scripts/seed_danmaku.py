import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal, engine
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from app import crud
from app.utils.logger import app_logger
import uuid


def get_test_users(db):
    """获取测试用户"""
    return db.query(User).filter(User.is_active == True).all()


def seed_danmaku(db):
    """新增弹幕数据"""
    users = get_test_users(db)
    if not users:
        app_logger.error("没有找到测试用户，请先运行 seed_test_data.py")
        return

    danmaku_contents = [
        "这个UI设计太酷了！🎮",
        "FastAPI + React = 完美组合 💻",
        "赛博朋克风格爱了 😍",
        "弹幕效果很有意思 ✨",
        "代码质量很高 👍",
        "期待更多文章 📚",
        "技术栈选得真好 🚀",
        "玻璃拟态设计感拉满 🪟",
        "TypeScript 类型系统很棒 🔷",
        "Tailwind CSS 真香 🎨",
        "Next.js App Router 好用 ⚡",
        "PostgreSQL 数据库稳定 🗄️",
        "Redis 缓存很重要 ⚡",
        "Docker 容器化部署很方便 🐳",
        "Python 异步编程很优雅 🐍",
        "SQLAlchemy ORM 很强大 🗄️",
        "Framer Motion 动画很丝滑 ✨",
        "Lucide 图标库很美 🎨",
        "Glassmorphism 设计趋势 🪟",
        "Cyberpunk 风格永不过时 🌃",
        "前端性能优化很重要 ⚡",
        "API 设计很规范 📡",
        "测试覆盖率很重要 🧪",
        "CI/CD 自动化很必要 🔄",
        "代码审查很有价值 👀",
        "文档写得很清楚 📄",
        "错误处理很完善 🔧",
        "日志系统很重要 📋",
        "安全性第一 🔒",
        "用户体验至上 👤",
        "响应式设计很棒 📱",
        "暗黑模式支持很好 🌙",
        "移动端适配很完美 📲",
        "性能优化做得好 ⚡",
        "动画效果很流畅 ✨",
        "交互设计很赞 👍",
        "配色方案很有品味 🎨",
        "字体选择很专业 🔤",
        "排版很舒适 📄",
        "细节打磨很到位 🔍",
        "加载速度很快 ⚡",
    ]

    colors = ["#00D9FF", "#FF6B9D", "#FFE66D", "#4ECDC4", "#A855F7", "#FF6B6B", "#FFFFFF"]

    app_logger.info(f"准备创建 {len(danmaku_contents)} 条弹幕...")

    created_count = 0
    for i, content in enumerate(danmaku_contents):
        # 检查是否已存在
        existing = db.query(Message).filter(Message.content == content).first()
        if existing:
            continue

        user = users[i % len(users)]
        color = colors[i % len(colors)]

        msg_create = MessageCreate(
            content=content,
            color=color,
            is_danmaku=True
        )

        try:
            msg = crud.create_message(db, msg_create, author_id=user.id)
            created_count += 1
            app_logger.info(f"创建弹幕 [{i+1}/{len(danmaku_contents)}]: {content[:40]}...")
        except Exception as e:
            app_logger.error(f"创建弹幕失败: {e}")
            continue

    app_logger.success(f"成功创建 {created_count} 条弹幕！")


def main():
    db = SessionLocal()
    try:
        seed_danmaku(db)
    except Exception as e:
        app_logger.error(f"种子数据创建失败: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
