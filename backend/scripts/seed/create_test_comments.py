"""创建测试评论"""

import asyncio
import aiohttp
import json


async def create_test_comments(token):
    """创建测试评论"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        # 首先获取所有文章
        async with session.get(
            "http://localhost:8989/api/v1/articles/",
            headers=headers
        ) as response:
            if response.status == 200:
                articles = await response.json()
                if articles:
                    # 为每篇文章添加一条评论
                    for idx, article in enumerate(articles[:3]):  # 只为前3篇文章添加评论
                        comment_data = {
                            "content": f"这是对文章《{article['title']}》的评论，测试内容 {idx+1}。",
                            "article_id": str(article["id"])
                        }
                        
                        async with session.post(
                            "http://localhost:8989/api/v1/comments/",
                            json=comment_data,
                            headers=headers
                        ) as comment_response:
                            if comment_response.status == 200:
                                result = await comment_response.json()
                                print(f"评论创建成功: {result['content'][:50]}...")
                                print(f"  评论ID: {result['id']}")
                                print(f"  文章: {article['title']}")
                            else:
                                print(f"评论创建失败: HTTP {comment_response.status}")
                                error_text = await comment_response.text()
                                print(f"  错误详情: {error_text}")
                else:
                    print("没有找到文章来添加评论")
            else:
                print(f"获取文章列表失败: HTTP {response.status}")
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
    print("开始为文章创建测试评论...")
    await create_test_comments(token)
    print("测试评论创建完成")


if __name__ == "__main__":
    asyncio.run(main())