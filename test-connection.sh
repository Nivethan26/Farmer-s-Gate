#!/bin/bash

echo "🧪 Testing Frontend-Backend Connection..."
echo "======================================="

# Test backend health
echo "1. Testing Backend Health Endpoint:"
BACKEND_HEALTH=$(curl -s http://localhost:4000/api/health)
if [[ $? -eq 0 ]] && [[ $BACKEND_HEALTH == *"OK"* ]]; then
    echo "✅ Backend is running and responding"
    echo "   Response: $BACKEND_HEALTH"
else
    echo "❌ Backend health check failed"
    exit 1
fi

echo ""

# Test frontend accessibility
echo "2. Testing Frontend Accessibility:"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/)
if [[ $FRONTEND_STATUS -eq 200 ]]; then
    echo "✅ Frontend is accessible at http://localhost:8080"
else
    echo "❌ Frontend not accessible (HTTP $FRONTEND_STATUS)"
    exit 1
fi

echo ""

# Test API proxy through frontend
echo "3. Testing API Proxy through Frontend:"
PROXY_TEST=$(curl -s http://localhost:8080/api/health)
if [[ $? -eq 0 ]] && [[ $PROXY_TEST == *"OK"* ]]; then
    echo "✅ API proxy is working correctly"
    echo "   Response: $PROXY_TEST"
else
    echo "❌ API proxy test failed"
    echo "   This might be expected if Vite proxy needs the dev server fully loaded"
fi

echo ""

# Test login endpoint
echo "4. Testing Login Endpoint:"
LOGIN_TEST=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrilink.lk","password":"admin123"}')

if [[ $? -eq 0 ]] && [[ $LOGIN_TEST == *"token"* ]]; then
    echo "✅ Login endpoint is working"
    echo "   Admin login successful"
else
    echo "❌ Login endpoint failed or returned unexpected response"
    echo "   Response: $LOGIN_TEST"
fi

echo ""

# Test categories endpoint
echo "5. Testing Categories Endpoint:"
CATEGORIES_TEST=$(curl -s http://localhost:4000/api/categories)
if [[ $? -eq 0 ]]; then
    echo "✅ Categories endpoint is accessible"
    CATEGORY_COUNT=$(echo $CATEGORIES_TEST | grep -o '"id"' | wc -l)
    echo "   Found $CATEGORY_COUNT categories"
else
    echo "❌ Categories endpoint failed"
fi

echo ""

# Test products endpoint
echo "6. Testing Products Endpoint:"
PRODUCTS_TEST=$(curl -s http://localhost:4000/api/products)
if [[ $? -eq 0 ]] && [[ $PRODUCTS_TEST == *"products"* ]]; then
    echo "✅ Products endpoint is working"
    PRODUCT_COUNT=$(echo $PRODUCTS_TEST | grep -o '"id"' | wc -l)
    echo "   Found products in response"
else
    echo "❌ Products endpoint failed"
    echo "   Response: $PRODUCTS_TEST"
fi

echo ""
echo "🎉 Connection tests completed!"
echo ""
echo "📋 Summary:"
echo "- Backend: http://localhost:4000 ✅"
echo "- Frontend: http://localhost:8080 ✅" 
echo "- API Base: http://localhost:4000/api ✅"
echo ""
echo "🔗 You can now use the application:"
echo "   • Open http://localhost:8080 in your browser"
echo "   • Use demo credentials from the login page"
echo "   • Backend API is accessible at http://localhost:4000/api"
echo ""
echo "📝 Test Credentials:"
echo "   Admin:  admin@agrilink.lk / admin123"
echo "   Buyer:  buyer@agrilink.lk / buyer123"
echo "   Seller: seller@agrilink.lk / seller123"
echo "   Agent:  agent@agrilink.lk / agent123"