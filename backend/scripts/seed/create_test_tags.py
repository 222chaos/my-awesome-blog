"""创建测试标签"""

import asyncio
import aiohttp
import json


async def create_test_tags(token):
    """创建测试标签"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        # 创建几个测试标签
        tags = [
            {
                "name": "Python",
                "description": "Python编程语言相关内容",
                "slug": "python"
            },
            {
                "name": "JavaScript",
                "description": "JavaScript编程语言相关内容",
                "slug": "javascript"
            },
            {
                "name": "数据库",
                "description": "数据库技术相关内容",
                "slug": "database"
            }
        ]
        
        for tag_data in tags:
            async with session.post(
                "http://localhost:8989/api/v1/tags/",
                json=tag_data,
                headers=headers
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"标签创建成功: {result['name']}")
                    print(f"  ID: {result['id']}")
                    print(f"  Slug: {result['slug']}")
                else:
                    print(f"标签创建失败: HTTP {response.status}")
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
    print("开始创建测试标签...")
    await create_test_tags(token)
    print("测试标签创建完成")


if __name__ == "__main__":
    asyncio.run(main())