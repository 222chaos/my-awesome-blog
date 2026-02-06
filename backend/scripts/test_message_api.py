import requests
import json

base_url = "http://127.0.0.1:8989/api/v1"

print("测试 trending API...")
try:
    response = requests.get(f"{base_url}/messages/trending", params={"limit": 5})
    print(f"Status: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

print("\n测试 activity API...")
try:
    response = requests.get(f"{base_url}/messages/stats/activity", params={"days": 7})
    print(f"Status: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
