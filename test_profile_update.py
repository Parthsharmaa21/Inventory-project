import requests
import json

# Test profile update endpoint
url = "http://localhost:5000/update_profile"
data = {
    "user_id": 1,
    "role": "user",
    "name": "Updated User Name",
    "email": "updated@example.com",
    "phone": "9876543210"
}

try:
    response = requests.put(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
