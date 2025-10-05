#!/bin/bash
# Complete API test script

echo "🔐 Testing Admin Login..."
echo "========================"

# Test login and capture token
LOGIN_RESPONSE=$(curl -s -X POST http://66.116.199.206:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aynbeauty.com","password":"admin123"}')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token (assuming it's returned as {"token": "..."})
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed or no token received"
  exit 1
fi

echo "✅ Login successful, token received"
echo "Token: ${TOKEN:0:20}..."

echo ""
echo "📦 Testing Inventory API..."
echo "=========================="

# Test inventory API with token
INVENTORY_RESPONSE=$(curl -s -X POST http://66.116.199.206:3000/api/admin/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product via API",
    "description": "This is a test product created via API",
    "price": 29.99,
    "category": "Skincare",
    "stock_quantity": 10,
    "is_trending": false,
    "is_must_have": false,
    "is_new_arrival": true
  }')

echo "Inventory Response: $INVENTORY_RESPONSE"

if [[ $INVENTORY_RESPONSE == *"success"* ]]; then
  echo "✅ Product created successfully!"
else
  echo "❌ Product creation failed"
fi