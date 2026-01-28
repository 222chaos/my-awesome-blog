"""验证数据是否正确插入"""

import asyncio
import aiohttp
import json


async def verify_data(token):
    """验证数据"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        # 检查用户
        print("检查用户数据...")
        async with session.get(
            "http://localhost:8989/api/v1/users/me",
            headers=headers
        ) as response:
            if response.status == 200:
                user_data = await response.json()
                print(f"  ✓ 当前用户: {user_data['full_name']} ({user_data['email']})")
            else:
                print(f"  ✗ 获取用户信息失败: HTTP {response.status}")
        
        # 检查文章
        print("\n检查文章数据...")
        async with session.get(
            "http://localhost:8989/api/v1/articles/",
            headers=headers
        ) as response:
            if response.status == 200:
                articles = await response.json()
                print(f"  ✓ 找到 {len(articles)} 篇文章")
                for article in articles:
                    print(f"    - {article['title']} (ID: {article['id']})")
            else:
                print(f"  ✗ 获取文章列表失败: HTTP {response.status}")
        
        # 检查分类
        print("\n检查分类数据...")
        async with session.get(
            "http://localhost:8989/api/v1/categories/",
            headers=headers
        ) as response:
            if response.status == 200:
                categories = await response.json()
                print(f"  ✓ 找到 {len(categories)} 个分类")
                for category in categories:
                    print(f"    - {category['name']} (ID: {category['id']})")
            else:
                print(f"  ✗ 获取分类列表失败: HTTP {response.status}")
        
        # 检查标签
        print("\n检查标签数据...")
        async with session.get(
            "http://localhost:8989/api/v1/tags/",
            headers=headers
        ) as response:
            if response.status == 200:
                tags = await response.json()
                print(f"  ✓ 找到 {len(tags)} 个标签")
                for tag in tags:
                    print(f"    - {tag['name']} (ID: {tag['id']})")
            else:
                print(f"  ✗ 获取标签列表失败: HTTP {response.status}")
        
        # 检查评论
        print("\n检查评论数据...")
        async with session.get(
            "http://localhost:8989/api/v1/comments/",
            headers=headers
        ) as response:
            if response.status == 200:
                comments = await response.json()
                print(f"  ✓ 找到 {len(comments)} 条评论")
                for comment in comments:
                    print(f"    - {comment['content'][:50]}... (ID: {comment['id']})")
            else:
                print(f"  ✗ 获取评论列表失败: HTTP {response.status}")


async def get_token():
    """获取访问令牌"""
    async with aiohttp.ClientSession() as session:
        # 登录URL
        login_url = "http://localhost:8989/api/v1/auth/login-json"
        
        # 登录数据
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        # 发送登录请求
        async with session.post(login_url, json=login_data) as response:
            if response.status == 200:
                result = await response.json()
                return result.get("access_token")
            else:
                print(f"登录失败：HTTP {response.status}")
                error_text = await response.text()
                print(f"错误详情: {error_text}")
                return None


async def main():
    print("正在获取访问令牌...")
    token = await get_token()
    
    if not token:
        print("无法获取访问令牌，退出")
        return
    
    print("成功获取访问令牌")
    print("开始验证数据...")
    await verify_data(token)
    print("\n数据验证完成")


if __name__ == "__main__":
    asyncio.run(main())