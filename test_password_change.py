import requests
import json

# Test password change endpoint
url = "http://localhost:5000/change_password"
data = {
    "user_id": 1,
    "role": "user",
    "current_password": "password123",
    "new_password": "newpassword123"
}

try:
    response = requests.put(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
