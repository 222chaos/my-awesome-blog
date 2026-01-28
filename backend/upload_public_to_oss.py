"""
将前端 public 目录中的文件上传到阿里云OSS的test目录中
用于测试上传和获取功能
"""

import os
import asyncio
from pathlib import Path
from app.services.oss_service import oss_service
from app.utils.oss_utils import upload_local_file_to_oss

async def upload_public_assets_to_oss():
    """
    上传前端 public 目录中的文件到OSS
    """
    # 定义前端public目录路径
    frontend_public_dir = Path("../frontend/public")
    
    if not frontend_public_dir.exists():
        print(f"前端 public 目录不存在: {frontend_public_dir.absolute()}")
        return
    
    print("开始上传前端 public 目录中的文件到OSS...")
    
    # 递归遍历前端public目录中的所有文件
    for file_path in frontend_public_dir.rglob("*"):
        if file_path.is_file():
            # 计算相对于public目录的路径
            relative_path = file_path.relative_to(frontend_public_dir)
            oss_folder = f"test/{relative_path.parent}"
            
            print(f"正在上传文件: {relative_path} 到 OSS 目录: {oss_folder}")
            
            try:
                # 使用工具函数上传文件
                file_url = upload_local_file_to_oss(
                    local_file_path=str(file_path),
                    oss_folder=oss_folder,
                    oss_filename=file_path.name
                )
                
                if file_url:
                    print(f"✓ 上传成功: {file_url}")
                else:
                    print(f"✗ 上传失败: {relative_path}")
                    
            except Exception as e:
                print(f"✗ 上传 {relative_path} 时发生错误: {str(e)}")
    
    print("\n文件上传完成！")

async def test_oss_functionality():
    """
    测试OSS的基本功能
    """
    print("开始测试OSS基本功能...")
    
    # 测试上传一个小文本文件
    test_data = "This is a test file for OSS functionality.".encode('utf-8')
    test_file_url = oss_service.upload_file(
        file_data=test_data,
        file_name="test_file.txt",
        folder="test"
    )
    
    if test_file_url:
        print(f"✓ 文本文件上传成功: {test_file_url}")
        
        # 测试文件是否存在
        # 从URL中提取文件路径
        file_path = test_file_url.replace(f"https://{oss_service.cdn_domain or oss_service.bucket_name}.{oss_service.endpoint.replace('https://', '')}/", "")
        exists = oss_service.file_exists(file_path)
        print(f"✓ 文件存在检查: {exists}")
        
        # 测试删除功能
        delete_result = oss_service.delete_file(test_file_url)
        print(f"✓ 文件删除结果: {delete_result}")
    else:
        print("✗ 文本文件上传失败")

async def main():
    """
    主函数
    """
    print("="*50)
    print("阿里云OSS上传功能测试")
    print("="*50)
    
    # 首先测试基本功能
    await test_oss_functionality()
    
    print("\n" + "="*50)
    print("开始上传前端public目录中的文件")
    print("="*50)
    
    # 然后上传前端public目录中的文件
    await upload_public_assets_to_oss()

if __name__ == "__main__":
    asyncio.run(main())