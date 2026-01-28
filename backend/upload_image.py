"""上传图片到后端"""

import asyncio
import aiohttp
import json
from pathlib import Path


async def upload_image(token, image_path):
    """上传图片到后端"""
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    async with aiohttp.ClientSession() as session:
        with open(image_path, 'rb') as f:
            data = aiohttp.FormData()
            data.add_field('file', f, filename=Path(image_path).name)
            
            async with session.post(
                "http://localhost:8989/api/v1/images/",
                data=data,
                headers=headers
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"图片上传成功: {result['filename']}")
                    return result
                else:
                    print(f"图片上传失败: HTTP {response.status}")
                    error_text = await response.text()
                    print(f"错误详情: {error_text}")
                    return None


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
    
    # 图片路径
    image_paths = [
        r"..\frontend\public\assets\avatar.jpg",
        r"..\frontend\public\assets\avatar1.jpg",
        r"..\frontend\public\assets\lulu.gif"
    ]
    
    print("开始上传图片...")
    
    for img_path in image_paths:
        abs_path = Path(__file__).parent / img_path
        if abs_path.exists():
            print(f"正在上传 {abs_path.name}...")
            await upload_image(token, str(abs_path))
        else:
            print(f"文件不存在: {abs_path}")
    
    print("图片上传完成")


if __name__ == "__main__":
    asyncio.run(main())