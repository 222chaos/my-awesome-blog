"""
修复timeline_events表color列长度
"""
from app.core.database import engine
from sqlalchemy import text

def fix_timeline_color_column():
    """修复timeline_events表color列长度"""
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE timeline_events ALTER COLUMN color TYPE VARCHAR(100)"))
            conn.commit()
            print("timeline_events.color列已更新为VARCHAR(100)")
        except Exception as e:
            print(f"更新失败: {e}")
            conn.rollback()

if __name__ == "__main__":
    fix_timeline_color_column()
