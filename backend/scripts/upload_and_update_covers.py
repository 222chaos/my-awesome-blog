"""
下载图片并上传到OSS，然后更新文章封面图
"""
import sys
from pathlib import Path
import requests
import os
import io

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


def download_image(url: str) -> tuple[bytes, str]:
    """下载图片"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        content_type = response.headers.get('content-type', 'image/jpeg')
        filename = url.split('/')[-1].split('?')[0]
        if not filename or '.' not in filename:
            filename = 'cover.jpg'
        return response.content, filename, content_type
    except Exception as e:
        print(f"✗ 下载图片失败 {url}: {e}")
        return None, None, None


def upload_image(token: str, image_data: bytes, filename: str, content_type: str) -> dict:
    """上传图片到OSS"""
    url = f"{BASE_URL}/images/"
    headers = {"Authorization": f"Bearer {token}"}
    
    files = {
        'file': (filename, io.BytesIO(image_data), content_type)
    }
    data = {
        'title': filename.replace('_', ' ').replace('-', ' ').title(),
        'alt_text': filename.replace('_', ' ').replace('-', ' '),
        'is_featured': False
    }
    
    try:
        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"✗ 上传图片失败 {filename}: {e}")
        if response:
            print(f"  响应: {response.text}")
        return None


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
        print(f"✗ 更新文章失败 {article_id}: {e}")
        if response:
            print(f"  响应: {response.text}")
        return False


def main():
    """主函数"""
    print("=" * 80)
    print("下载图片并上传到OSS，更新文章封面图")
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
        
        print(f"\n3. 准备封面图URL...")
        article_images = [
            {
                "title": "FastAPI异步编程完全指南",
                "slug": "fastapi-async-programming-guide",
                "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bec8e?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "React Server Components深度解析",
                "slug": "react-server-components-deep-dive",
                "image_url": "https://images.unsplash.com/photo-16333561212445-7b3f7356966?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "PostgreSQL全文搜索实战",
                "slug": "postgresql-fulltext-search",
                "image_url": "https://images.unsplash.com/photo-1544383882-7c9e8c7192ea?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "Docker多阶段构建优化镜像",
                "slug": "docker-multi-stage-build-optimization",
                "image_url": "https://images.unsplash.com/photo-1605745341112-85936b00f2d9?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "AI大模型应用开发实战",
                "slug": "ai-llm-application-development",
                "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad9956?w=800&h=400&fit=crop&q=80"
            },
            {
                "title": "TypeScript高级类型编程",
                "slug": "typescript-advanced-type-programming",
                "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop&q=80"
            }
        ]
        
        print(f"\n4. 下载图片并上传到OSS...")
        uploaded_count = 0
        skipped_count = 0
        failed_count = 0
        
        for article in articles:
            article_id = str(article.get('id', ''))
            article_slug = article.get('slug', '')
            existing_cover = article.get('cover_image', '')
            
            if existing_cover and 'via.placeholder.com' not in existing_cover:
                print(f"⊘ 文章已有封面图: {article.get('title', 'Unknown')}")
                skipped_count += 1
                continue
            
            img_data = next((item for item in article_images if item['slug'] == article_slug), None)
            
            if not img_data:
                print(f"✗ 未找到匹配的图片: {article_slug}")
                failed_count += 1
                continue
            
            print(f"\n处理文章: {article.get('title', 'Unknown')}")
            print(f"  下载图片: {img_data['image_url']}")
            
            image_content, filename, content_type = download_image(img_data['image_url'])
            
            if not image_content:
                print(f"  ✗ 下载失败")
                failed_count += 1
                continue
            
            print(f"  上传图片: {filename}")
            upload_result = upload_image(token, image_content, filename, content_type)
            
            if not upload_result:
                print(f"  ✗ 上传失败")
                failed_count += 1
                continue
            
            oss_url = upload_result.get('filepath', '')
            
            if not oss_url:
                print(f"  ✗ 未获取到OSS URL")
                failed_count += 1
                continue
            
            print(f"  OSS URL: {oss_url}")
            
            result = update_article(token, article_id, {
                "cover_image": oss_url
            })
            
            if result:
                print(f"  ✓ 文章更新成功")
                uploaded_count += 1
            else:
                print(f"  ✗ 文章更新失败")
                failed_count += 1
        
        print(f"\n" + "=" * 80)
        print(f"操作完成！")
        print(f"  成功: {uploaded_count} 篇")
        print(f"  跳过: {skipped_count} 篇")
        print(f"  失败: {failed_count} 篇")
        print(f"  总计: {len(articles)} 篇")
        print("=" * 80)
        
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
