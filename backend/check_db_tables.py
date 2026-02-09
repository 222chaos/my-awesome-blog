import psycopg2
from psycopg2 import sql

def check_tables():
    conn = psycopg2.connect(
        dbname="my_awesome_blog",
        user="postgres",
        password="123456",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)
    
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"  - {table[0]}")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    check_tables()