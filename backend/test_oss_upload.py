"""
测试阿里云OSS上传功能
"""

import asyncio
from app.services.oss_service import oss_service

async def test_oss_connection():
    """
    测试OSS连接和上传功能
    """
    print("开始测试OSS连接...")
    
    # 准备测试数据
    test_data = b"This is a test file content for OSS upload."
    test_filename = "test_file.txt"
    
    # 上传文件到OSS
    print("正在上传测试文件到OSS...")
    file_url = oss_service.upload_file(test_data, test_filename, "test")
    
    if file_url:
        print(f"文件上传成功! 文件URL: {file_url}")
        
        # 测试删除功能
        print("正在测试删除功能...")
        delete_success = oss_service.delete_file(file_url)
        if delete_success:
            print("文件删除成功!")
        else:
            print("文件删除失败!")
    else:
        print("文件上传失败!")

if __name__ == "__main__":
    asyncio.run(test_oss_connection())