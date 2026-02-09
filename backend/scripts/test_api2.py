import requests

# 获取所有相册
response = requests.get("http://127.0.0.1:8989/api/v1/albums/")
albums = response.json()

# 找到有图片的相册
print("查找有图片的相册...")
for album in albums:
    if album['images'] > 0:
        album_id = album['id']
        album_title = album['title']
        print(f"\n找到相册: {album_title} (ID: {album_id})")
        print(f"显示图片数: {album['images']}")
        
        # 获取该相册的图片
        response = requests.get(f"http://127.0.0.1:8989/api/v1/albums/{album_id}/images")
        images = response.json()
        print(f"实际图片数量: {len(images)}")
        
        if len(images) > 0:
            print("\n前3张图片:")
            for i, img in enumerate(images[:3]):
                print(f"  {i+1}. {img.get('caption', 'N/A')}")
                print(f"     URL: {img.get('url', 'N/A')}")
                print(f"     Sort Order: {img.get('sortOrder', 'N/A')}")
        break
