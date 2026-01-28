"""创建测试文章"""

import asyncio
import aiohttp
import json


async def create_test_articles(token):
    """创建测试文章"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        # 创建几篇测试文章
        articles = [
            {
                "title": "欢迎来到我的博客",
                "content": "这是我的第一篇文章，欢迎阅读！",
                "excerpt": "欢迎来到我的博客",
                "is_published": True,
                "tags": ["welcome", "blog"]
            },
            {
                "title": "如何使用FastAPI开发后端",
                "content": "FastAPI是一个现代、快速（高性能）的Web框架，用于基于Python类型提示构建API。",
                "excerpt": "FastAPI开发指南",
                "is_published": True,
                "tags": ["fastapi", "python", "backend"]
            },
            {
                "title": "React与Next.js前端开发技巧",
                "content": "Next.js是React的流行框架，提供了很多开箱即用的功能。",
                "excerpt": "React与Next.js开发",
                "is_published": True,
                "tags": ["react", "nextjs", "frontend"]
            }
        ]
        
        for article_data in articles:
            async with session.post(
                "http://localhost:8989/api/v1/articles/",
                json=article_data,
                headers=headers
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"文章创建成功: {result['title']}")
                    print(f"  ID: {result['id']}")
                    print(f"  Slug: {result['slug']}")
                else:
                    print(f"文章创建失败: HTTP {response.status}")
                    error_text = await response.text()
                    print(f"  错误详情: {error_text}")


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
    print("开始创建测试文章...")
    await create_test_articles(token)
    print("测试文章创建完成")


if __name__ == "__main__":
    asyncio.run(main())