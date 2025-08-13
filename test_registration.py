import requests
import json

# Test registration endpoint
url = "http://localhost:5000/register"
data = {
    "name": "Test User",
    "phone": "1234567890",
    "email": "test@example.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
