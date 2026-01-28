"""测试管理员登录"""

import asyncio
import aiohttp
import json


async def test_login():
    """测试管理员登录"""
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
                token = result.get("access_token")
                
                if token:
                    print("登录成功！")
                    print(f"访问令牌: {token[:20]}...")  # 只显示前20个字符
                    return token
                else:
                    print("登录失败：未返回访问令牌")
                    return None
            else:
                print(f"登录失败：HTTP {response.status}")
                error_text = await response.text()
                print(f"错误详情: {error_text}")
                return None


async def test_protected_endpoint(token):
    """测试受保护的端点"""
    if not token:
        print("没有有效的访问令牌，无法测试受保护的端点")
        return
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    async with aiohttp.ClientSession() as session:
        # 测试获取用户信息端点
        url = "http://localhost:8989/api/v1/users/me"
        
        async with session.get(url, headers=headers) as response:
            if response.status == 200:
                user_data = await response.json()
                print("成功访问受保护端点！")
                print(f"用户信息: {user_data}")
            else:
                print(f"访问受保护端点失败：HTTP {response.status}")
                error_text = await response.text()
                print(f"错误详情: {error_text}")


async def main():
    print("开始测试管理员登录...")
    token = await test_login()
    
    print("\n测试受保护端点...")
    await test_protected_endpoint(token)
    
    print("\n登录测试完成")


if __name__ == "__main__":
    asyncio.run(main())