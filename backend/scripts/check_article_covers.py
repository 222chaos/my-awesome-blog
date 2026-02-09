"""
检查文章封面图情况
"""
import sys
from pathlib import Path
import requests

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

BASE_URL = "http://127.0.0.1:8989/api/v1"


def login(username: str, password: str) -> str:
    """
    登录获取 access_token
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
        return token_data["access_token"]
    except requests.exceptions.RequestException as e:
        print(f"✗ 登录失败: {e}")
        sys.exit(1)


def get_articles(token: str) -> list:
    """
    获取所有文章列表
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
    print("=" * 80)
    print("文章封面图检查")
    print("=" * 80)
    
    try:
        print(f"\n登录获取Token...")
        token = login("admin", "admin123")
        
        print(f"\n获取文章列表...")
        articles = get_articles(token)
        
        if not articles:
            print("没有找到文章")
            return
        
        print(f"\n共找到 {len(articles)} 篇文章\n")
        print(f"{'序号':<4} {'标题':<30} {'封面图':<50}")
        print("-" * 84)
        
        for i, article in enumerate(articles, 1):
            title = article.get('title', 'Unknown')
            cover = article.get('cover_image', '无')
            slug = article.get('slug', 'unknown')
            
            cover_display = f"{cover[:47]} ..." if len(cover) > 50 else cover
            print(f"{i:<4} {title[:28]:<28} ... {cover_display:<50}")
        
        print("=" * 80)
        
        if all(article.get('cover_image') for article in articles):
            print("\n✓ 所有文章都已设置封面图")
        else:
            no_cover_count = sum(1 for article in articles if not article.get('cover_image'))
            print(f"\n✗ 有 {no_cover_count} 篇文章没有封面图")
        
    except KeyboardInterrupt:
        print("\n操作被用户中断")
        sys.exit(0)
    except Exception as e:
        print(f"\n发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
