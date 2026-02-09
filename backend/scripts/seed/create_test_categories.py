"""创建测试分类"""

import asyncio
import aiohttp
import json


async def create_test_categories(token):
    """创建测试分类"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        # 创建几个测试分类
        categories = [
            {
                "name": "技术分享",
                "description": "关于技术的文章和教程",
                "slug": "tech-sharing"
            },
            {
                "name": "生活随笔",
                "description": "日常生活的感悟和记录",
                "slug": "life-essays"
            },
            {
                "name": "学习笔记",
                "description": "学习过程中的笔记和总结",
                "slug": "study-notes"
            }
        ]
        
        for category_data in categories:
            async with session.post(
                "http://localhost:8989/api/v1/categories/",
                json=category_data,
                headers=headers
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"分类创建成功: {result['name']}")
                    print(f"  ID: {result['id']}")
                    print(f"  Slug: {result['slug']}")
                else:
                    print(f"分类创建失败: HTTP {response.status}")
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
    print("开始创建测试分类...")
    await create_test_categories(token)
    print("测试分类创建完成")


if __name__ == "__main__":
    asyncio.run(main())