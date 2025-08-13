import requests
import json

# Test admin registration endpoint
url = "http://localhost:5000/register"
data = {
    "name": "Test Admin",
    "phone": "0987654321",
    "email": "admin@test.com",
    "password": "adminpassword123",
    "role": "admin"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
