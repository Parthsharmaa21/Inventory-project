import requests

# Test analytics endpoints
base_url = "http://localhost:5000"

def test_endpoint(endpoint):
    try:
        response = requests.get(f"{base_url}{endpoint}")
        print(f"{endpoint}: {response.status_code}")
        if response.status_code == 200:
            print(f"  Data: {response.json()}")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"{endpoint}: Error - {str(e)}")

# Test all analytics endpoints
endpoints = [
    "/analytics/overview",
    "/analytics/most-sold",
    "/analytics/least-sold",
    "/analytics/product-sales"
]

print("Testing Analytics Endpoints:")
for endpoint in endpoints:
    test_endpoint(endpoint)
