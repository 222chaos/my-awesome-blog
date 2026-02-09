import psycopg2
from psycopg2 import sql

def init_database():
    conn = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="123456",
        host="localhost",
        port="5432"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    try:
        cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(
            sql.Identifier("my_awesome_blog")
        ))
        print("Database dropped successfully")
    except Exception as e:
        print(f"Error dropping database: {e}")
    
    try:
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(
            sql.Identifier("my_awesome_blog")
        ))
        print("Database created successfully")
    except Exception as e:
        print(f"Error creating database: {e}")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    init_database()