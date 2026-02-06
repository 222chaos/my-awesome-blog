import requests
import json

base_url = "http://127.0.0.1:8989/api/v1"

print("=" * 50)
print("1. 测试登录端点")
print("=" * 50)

# Test login with admin credentials
login_data = {
    "username": "admin",
    "password": "admin123"
}

try:
    response = requests.post(f"{base_url}/auth/login-json", json=login_data)
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        if token:
            print(f"\n登录成功！Token: {token[:50]}...")

            # Test /users/me endpoint
            print("\n" + "=" * 50)
            print("2. 测试 /users/me 端点")
            print("=" * 50)

            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }

            me_response = requests.get(f"{base_url}/users/me", headers=headers)
            print(f"Status: {me_response.status_code}")
            print(f"Headers: {dict(me_response.headers)}")
            try:
                print(f"Response: {json.dumps(me_response.json(), indent=2, ensure_ascii=False)}")
            except:
                print(f"Response text: {me_response.text[:500]}")
        else:
            print("\n错误：响应中没有 access_token")
except Exception as e:
    print(f"请求失败: {e}")

print("\n" + "=" * 50)
print("3. 测试未授权访问")
print("=" * 50)

# Test without token
me_response_no_auth = requests.get(f"{base_url}/users/me")
print(f"Status (no auth): {me_response_no_auth.status_code}")
print(f"Response (no auth): {me_response_no_auth.text[:200]}")
