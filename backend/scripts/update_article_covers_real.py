"""
使用真实图片更新文章封面图
从Unsplash等免费图床获取高质量技术类图片
"""
import sys
from pathlib import Path
import requests

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

BASE_URL = "http://127.0.0.1:8989/api/v1"


def login(username: str, password: str) -> str:
    """登录获取 access_token"""
    url = f"{BASE_URL}/auth/login-json"
    payload = {"username": username, "password": password}
    
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


def get_articles(token: str) -> list:
    """获取所有文章列表"""
    url = f"{BASE_URL}/articles/"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"✗ 获取文章列表失败: {e}")
        return []


def update_article(token: str, article_id: str, article_data: dict) -> bool:
    """更新文章"""
    url = f"{BASE_URL}/articles/{article_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.put(url, json=article_data, headers=headers)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ 更新文章失败: {article_id}")
        print(f"  错误: {e}")
        if response:
            print(f"  响应: {response.text}")
        return False


def main():
    """主函数"""
    print("=" * 80)
    print("使用真实图片更新文章封面图")
    print("=" * 80)
    
    try:
        print(f"\n1. 登录获取Token...")
        token = login("admin", "admin123")
        
        print(f"\n2. 获取文章列表...")
        articles = get_articles(token)
        print(f"   找到 {len(articles)} 篇文章")
        
        if not articles:
            print("\n没有找到文章，退出")
            return
        
        print(f"\n3. 更新文章封面图...")
        
        article_covers = [
            {
                "title": "FastAPI异步编程完全指南",
                "slug": "fastapi-async-programming-guide",
                "cover_image": "https://images.unsplash.com/photo-1555066931-4365d14bec8e?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "React Server Components深度解析",
                "slug": "react-server-components-deep-dive",
                "cover_image": "https://images.unsplash.com/photo-163335612445-7b3f7356966?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "PostgreSQL全文搜索实战",
                "slug": "postgresql-fulltext-search",
                "cover_image": "https://images.unsplash.com/photo-1544383882-7c9e8c7192ea?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "Docker多阶段构建优化镜像",
                "slug": "docker-multi-stage-build-optimization",
                "cover_image": "https://images.unsplash.com/photo-1605745341112-85936b00f2d9?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "AI大模型应用开发实战",
                "slug": "ai-llm-application-development",
                "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad9956?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "TypeScript高级类型编程",
                "slug": "typescript-advanced-type-programming",
                "cover_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop&q=80"
            }
        ]
        
        updated_count = 0
        skipped_count = 0
        
        for article in articles:
            article_id = str(article.get('id', ''))
            article_slug = article.get('slug', '')
            existing_cover = article.get('cover_image', '')
            
            cover_data = next((item for item in article_covers if item['slug'] == article_slug), None)
            
            if not cover_data:
                print(f"⊘ 未找到匹配的封面图: {article.get('title', 'Unknown')}")
                skipped_count += 1
                continue
            
            if existing_cover and 'via.placeholder.com' not in existing_cover:
                print(f"⊘ 文章已有真实封面图: {article.get('title', 'Unknown')}")
                skipped_count += 1
                continue
            
            result = update_article(token, article_id, {
                "cover_image": cover_data['cover_image']
            })
            if result:
                print(f"✓ 封面图更新成功: {article.get('title', 'Unknown')}")
                updated_count += 1
        
        print(f"\n" + "=" * 80)
        print(f"操作完成！")
        print(f"  更新: {updated_count} 篇")
        print(f"  跳过: {skipped_count} 篇")
        print(f"  总计: {len(articles)} 篇")
        print("=" * 80)
        print("\n提示：图片来自 Unsplash，可能需要几秒钟才能加载")
        
    except KeyboardInterrupt:
        print("\n\n操作被用户中断")
        sys.exit(0)
    except Exception as e:
        print(f"\n发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
