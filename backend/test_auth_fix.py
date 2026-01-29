"""测试登录和获取用户信息"""
import requests
import json

BASE_URL = "http://127.0.0.1:8989/api/v1"

# 1. 尝试登录
print("1. 尝试登录...")
login_data = {
    "username": "admin",
    "password": "admin123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/login-json", json=login_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")

    if response.status_code == 200:
        token_data = response.json()
        token = token_data.get("access_token")
        print(f"获取到 token: {token[:50]}...")

        # 2. 使用 token 获取用户信息
        print("\n2. 使用 token 获取用户信息...")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        me_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"状态码: {me_response.status_code}")
        print(f"响应: {me_response.text}")

        if me_response.status_code == 200:
            user_data = me_response.json()
            print("\n✓ 成功获取用户信息:")
            print(json.dumps(user_data, indent=2, ensure_ascii=False))
        else:
            print("\n✗ 获取用户信息失败")
    else:
        print("\n✗ 登录失败")
except Exception as e:
    print(f"\n✗ 发生错误: {e}")
