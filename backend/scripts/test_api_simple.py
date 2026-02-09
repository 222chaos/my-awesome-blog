import requests
import json

# 测试获取相册列表
response = requests.get("http://127.0.0.1:8989/api/v1/albums/")
print(f"相册列表状态码: {response.status_code}")

if response.status_code == 200:
    albums = response.json()
    print(f"相册数量: {len(albums)}")
    
    # 找到有图片的相册
    print("\n所有相册:")
    for album in albums:
        print(f"  - {album['title']}: {album['images']} 张图片")
    
    if len(albums) > 0:
        album_id = albums[0]['id']
        album_title = albums[0]['title']
        print(f"\n测试相册: {album_title} (ID: {album_id})")
        
        # 测试获取相册图片
        response = requests.get(f"http://127.0.0.1:8989/api/v1/albums/{album_id}/images")
        print(f"图片列表状态码: {response.status_code}")
        images = response.json()
        print(f"图片数量: {len(images)}")
        
        if len(images) > 0:
            print("\n前3张图片:")
            for i, img in enumerate(images[:3]):
                print(f"  {i+1}. {img.get('caption', 'N/A')}")
                print(f"     URL: {img.get('url', 'N/A')}")
else:
    print(f"错误: {response.text}")
