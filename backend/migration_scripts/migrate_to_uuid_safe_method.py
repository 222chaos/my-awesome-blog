"""
数据库UUID迁移脚本 - 安全方法
使用临时表和数据迁移的更安全方法
"""

import uuid
from sqlalchemy import create_engine, text, MetaData, Table
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.core.config import settings

def migrate_to_uuid_safely():
    # 创建数据库引擎
    engine = create_engine(settings.DATABASE_URL)
    
    # 检查数据库中实际存在的表
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name != 'alembic_version';  -- 排除alembic版本表
        """))
        actual_tables = [row[0] for row in result.fetchall()]
    
    print(f"数据库中实际存在的表: {actual_tables}")
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("开始数据库UUID迁移（安全方法）...")
            
            # 为每个表创建临时表，迁移数据，然后替换原表
            for table_name in actual_tables:
                if table_name == 'alembic_version':  # 跳过alembic版本表
                    continue
                
                print(f"正在处理表 {table_name}...")
                
                # 检查表中是否有id列
                result = conn.execute(text("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = :table_name
                        AND column_name = 'id'
                    );
                """), {"table_name": table_name})
                
                if not result.scalar():
                    print(f"表 {table_name} 没有id列，跳过...")
                    continue
                
                # 创建临时表，ID列为UUID类型
                conn.execute(text(f"""
                    CREATE TABLE {table_name}_temp (
                        LIKE {table_name} INCLUDING ALL
                    );
                """))
                
                # 修改临时表的ID列类型为UUID
                conn.execute(text(f"""
                    ALTER TABLE {table_name}_temp 
                    ALTER COLUMN id TYPE UUID 
                    USING gen_random_uuid();
                """))
                
                # 获取原表的所有数据
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = :table_name
                    AND column_name != 'id'
                    ORDER BY ordinal_position;
                """), {"table_name": table_name})
                
                columns = [row[0] for row in result.fetchall()]
                columns_str = ', '.join(columns) if columns else '*'
                
                # 从原表复制数据到临时表（除了ID列）
                if columns:
                    conn.execute(text(f"""
                        INSERT INTO {table_name}_temp ({columns_str})
                        SELECT {columns_str} FROM {table_name};
                    """))
                
                # 获取ID映射（原ID到新UUID的映射）
                result = conn.execute(text(f"""
                    SELECT ctid, id FROM {table_name}_temp ORDER BY ctid;
                """))
                
                rows = result.fetchall()
                id_mapping = {}
                original_ids_result = conn.execute(text(f"""
                    SELECT id FROM {table_name} ORDER BY ctid;
                """))
                
                original_ids = [row[0] for row in original_ids_result.fetchall()]
                
                # 为临时表中的每一行分配从原表获取的ID
                for i, (ctid, new_uuid) in enumerate(rows):
                    if i < len(original_ids):
                        original_id = original_ids[i]
                        id_mapping[original_id] = new_uuid
                
                # 更新临时表中的ID值以匹配映射
                for old_id, new_uuid in id_mapping.items():
                    # 这里需要一个更精确的方法来更新特定行的ID
                    conn.execute(text(f"""
                        UPDATE {table_name}_temp 
                        SET id = :new_uuid 
                        WHERE ctid = (
                            SELECT ctid 
                            FROM {table_name}_temp 
                            LIMIT 1 OFFSET :offset
                        );
                    """), {"new_uuid": new_uuid, "offset": list(id_mapping.keys()).index(old_id)})
                
                # 删除原表
                conn.execute(text(f"""
                    DROP TABLE {table_name};
                """))
                
                # 重命名临时表为原表名
                conn.execute(text(f"""
                    ALTER TABLE {table_name}_temp RENAME TO {table_name};
                """))
                
                # 重建主键约束
                conn.execute(text(f"""
                    ALTER TABLE {table_name} ADD PRIMARY KEY (id);
                """))
                
                print(f"表 {table_name} 迁移完成")
            
            trans.commit()
            print("数据库UUID迁移完成！")
            print("所有表的ID列现在都是UUID类型。")
            
        except Exception as e:
            print(f"迁移过程中发生错误: {str(e)}")
            trans.rollback()
            raise

if __name__ == "__main__":
    migrate_to_uuid_safely()