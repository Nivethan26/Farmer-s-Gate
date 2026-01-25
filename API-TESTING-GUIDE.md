# Farmer's Gate API - Complete Testing Guide by Role

## 🌐 Base Information
- **Base URL**: `http://localhost:4000/api`
- **Content-Type**: `application/json`
- **Authorization Header**: `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 🏥 HEALTH CHECK (No Auth Required)

### Check API Status
```
GET http://localhost:4000/api/health
```
**No body required**

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Farmer's Gate API is running"
}
```

---

## 🔐 AUTHENTICATION (No Auth Required)

### 1. Register New User

#### Register as Buyer
```
POST http://localhost:4000/api/auth/register
```
```json
{
  "name": "Test Buyer",
  "email": "buyer@test.com",
  "password": "password123",
  "role": "buyer",
  "phone": "0771234567",
  "district": "Colombo",
  "address": "123 Main Street, Colombo"
}
```

#### Register as Seller
```
POST http://localhost:4000/api/auth/register
```
```json
{
  "name": "Farm Owner",
  "email": "seller@test.com",
  "password": "password123",
  "role": "seller",
  "phone": "0779876543",
  "district": "Kandy",
  "farmName": "Green Valley Farm",
  "address": "456 Farm Road, Kandy",
  "bank": {
    "accountName": "Farm Owner",
    "accountNo": "1234567890",
    "bankName": "Commercial Bank",
    "branch": "Kandy"
  }
}
```

#### Register as Agent
```
POST http://localhost:4000/api/auth/register
```
```json
{
  "name": "Agent Smith",
  "email": "agent@test.com",
  "password": "password123",
  "role": "agent",
  "phone": "0775551234",
  "regions": ["Colombo", "Gampaha", "Kalutara"],
  "officeContact": "0112345678"
}
```

### 2. Login

#### Login as Admin
```
POST http://localhost:4000/api/auth/login
```
```json
{
  "email": "admin@agrilink.lk",
  "password": "admin123"
}
```

#### Login as Buyer
```
POST http://localhost:4000/api/auth/login
```
```json
{
  "email": "buyer@agrilink.lk",
  "password": "buyer123"
}
```

#### Login as Seller
```
POST http://localhost:4000/api/auth/login
```
```json
{
  "email": "seller@agrilink.lk",
  "password": "seller123"
}
```

#### Login as Agent
```
POST http://localhost:4000/api/auth/login
```
```json
{
  "email": "agent@agrilink.lk",
  "password": "agent123"
}
```

**Expected Response (Save the token!):**
```json
{
  "_id": "user_id_here",
  "name": "Admin User",
  "email": "admin@agrilink.lk",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Profile (Requires Auth)
```
GET http://localhost:4000/api/auth/profile
Headers: Authorization: Bearer YOUR_TOKEN
```
**No body required**

### 4. Update Profile (Requires Auth)
```
PUT http://localhost:4000/api/auth/profile
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "name": "Updated Name",
  "phone": "0771111111",
  "address": "New Address"
}
```

### 5. Forgot Password
```
POST http://localhost:4000/api/auth/forgot-password
```
```json
{
  "email": "buyer@test.com"
}
```

### 6. Reset Password
```
POST http://localhost:4000/api/auth/reset-password
```
```json
{
  "email": "buyer@test.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## 👑 ADMIN ROLE ENDPOINTS

### 1. Get All Users
```
GET http://localhost:4000/api/users
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

**With Filters:**
```
GET http://localhost:4000/api/users?role=seller&pageNumber=1
Headers: Authorization: Bearer ADMIN_TOKEN
```

### 2. Get User Statistics
```
GET http://localhost:4000/api/users/stats
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

### 3. Get User By ID
```
GET http://localhost:4000/api/users/USER_ID_HERE
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

### 4. Update User Status
```
PUT http://localhost:4000/api/users/USER_ID_HERE
Headers: Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "status": "active"
}
```

**Other status values:** `pending`, `inactive`, `suspended`

### 5. Delete User
```
DELETE http://localhost:4000/api/users/USER_ID_HERE
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

### 6. Get All Orders (Admin)
```
GET http://localhost:4000/api/orders
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

**With Filters:**
```
GET http://localhost:4000/api/orders?status=pending&pageNumber=1
Headers: Authorization: Bearer ADMIN_TOKEN
```

### 7. Get Order Statistics
```
GET http://localhost:4000/api/orders/stats
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

### 8. Get All Negotiations (Admin)
```
GET http://localhost:4000/api/negotiations
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

**With Filters:**
```
GET http://localhost:4000/api/negotiations?status=open&pageNumber=1
Headers: Authorization: Bearer ADMIN_TOKEN
```

### 9. Get Negotiation Statistics
```
GET http://localhost:4000/api/negotiations/stats
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

### 10. Create Category
```
POST http://localhost:4000/api/categories
Headers: Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "name": "Vegetables",
  "slug": "vegetables",
  "icon": "🥬"
}
```

### 11. Update Category
```
PUT http://localhost:4000/api/categories/CATEGORY_ID_HERE
Headers: Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "name": "Fresh Vegetables",
  "icon": "🥕"
}
```

### 12. Delete Category
```
DELETE http://localhost:4000/api/categories/CATEGORY_ID_HERE
Headers: Authorization: Bearer ADMIN_TOKEN
```
**No body required**

---

## 🌾 SELLER ROLE ENDPOINTS

### 1. Get My Products
```
GET http://localhost:4000/api/products/myproducts
Headers: Authorization: Bearer SELLER_TOKEN
```
**No body required**

### 2. Create Product
```
POST http://localhost:4000/api/products
Headers: Authorization: Bearer SELLER_TOKEN
```
```json
{
  "name": "Fresh Tomatoes",
  "category": "Vegetables",
  "pricePerKg": 150,
  "supplyType": "wholesale",
  "locationDistrict": "Colombo",
  "stockQty": 500,
  "description": "Fresh organic tomatoes from our farm",
  "image": "https://example.com/tomato.jpg",
  "negotiationEnabled": true,
  "expiresOn": "2024-12-31T23:59:59.000Z"
}
```

**Note:** `sellerId` and `sellerName` are automatically filled from the authenticated user.

**Required Fields:**
- `name` - Product name
- `category` - Category name (must match existing category)
- `pricePerKg` - Price per kilogram
- `supplyType` - Either "wholesale" or "small_scale"
- `locationDistrict` - District name
- `stockQty` - Stock quantity in kg
- `description` - Product description
- `image` - Image URL
- `expiresOn` - Expiration date in ISO 8601 format

### 3. Update Product
```
PUT http://localhost:4000/api/products/PRODUCT_ID_HERE
Headers: Authorization: Bearer SELLER_TOKEN
```
```json
{
  "pricePerKg": 160,
  "stockQty": 450,
  "description": "Updated description"
}
```

### 4. Delete Product
```
DELETE http://localhost:4000/api/products/PRODUCT_ID_HERE
Headers: Authorization: Bearer SELLER_TOKEN
```
**No body required**

### 5. Get Seller Orders
```
GET http://localhost:4000/api/orders/seller
Headers: Authorization: Bearer SELLER_TOKEN
```
**No body required**

### 6. Get Seller Negotiations
```
GET http://localhost:4000/api/negotiations/seller
Headers: Authorization: Bearer SELLER_TOKEN
```
**No body required**

### 7. Update Negotiation (Counter Offer)
```
PUT http://localhost:4000/api/negotiations/NEGOTIATION_ID_HERE
Headers: Authorization: Bearer SELLER_TOKEN
```
```json
{
  "status": "countered",
  "counterPrice": 145,
  "counterNotes": "Best I can do is 145 per kg for bulk orders"
}
```

**Negotiation Status Options:** `open`, `countered`, `agreed`, `rejected`

### 8. Reject Negotiation
```
PUT http://localhost:4000/api/negotiations/NEGOTIATION_ID_HERE
Headers: Authorization: Bearer SELLER_TOKEN
```
```json
{
  "status": "rejected",
  "counterNotes": "Sorry, cannot offer lower price"
}
```

### 9. Accept Negotiation
```
PUT http://localhost:4000/api/negotiations/NEGOTIATION_ID_HERE
Headers: Authorization: Bearer SELLER_TOKEN
```
```json
{
  "status": "agreed",
  "agreedPrice": 140
}
```

---

## 🛒 BUYER ROLE ENDPOINTS

### 1. Get My Orders
```
GET http://localhost:4000/api/orders/myorders
Headers: Authorization: Bearer BUYER_TOKEN
```
**No body required**

### 2. Create Order
```
POST http://localhost:4000/api/orders
Headers: Authorization: Bearer BUYER_TOKEN
```
```json
{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "productName": "Fresh Tomatoes",
      "sellerId": "SELLER_ID_HERE",
      "sellerName": "Green Valley Farm",
      "qty": 10,
      "pricePerKg": 150
    },
    {
      "productId": "PRODUCT_ID_2",
      "productName": "Organic Carrots",
      "sellerId": "SELLER_ID_HERE",
      "sellerName": "Green Valley Farm",
      "qty": 5,
      "pricePerKg": 120
    }
  ],
  "address": "123 Delivery Street, Colombo 05",
  "subtotal": 2100,
  "deliveryFee": 200,
  "total": 2300,
  "redeemedPoints": 0
}
```

### 3. Get Buyer Negotiations
```
GET http://localhost:4000/api/negotiations/buyer
Headers: Authorization: Bearer BUYER_TOKEN
```
**No body required**

### 4. Create Negotiation
```
POST http://localhost:4000/api/negotiations
Headers: Authorization: Bearer BUYER_TOKEN
```
```json
{
  "productId": "PRODUCT_ID_HERE",
  "requestedPrice": 140,
  "notes": "Can you offer a better price for bulk order of 50kg?"
}
```

### 5. Accept Counter Offer
```
PUT http://localhost:4000/api/negotiations/NEGOTIATION_ID_HERE/accept-counter
Headers: Authorization: Bearer BUYER_TOKEN
```
**No body required**

### 6. Update Order Status (Upload Receipt)
```
PUT http://localhost:4000/api/orders/ORDER_ID_HERE/status
Headers: Authorization: Bearer BUYER_TOKEN
```
```json
{
  "status": "paid",
  "receiptUrl": "https://example.com/receipt.jpg"
}
```

---

## 🌍 PUBLIC ENDPOINTS (No Auth Required)

### 1. Get All Products
```
GET http://localhost:4000/api/products
```
**No body required**

**With Filters:**
```
GET http://localhost:4000/api/products?category=Vegetables&district=Colombo&supplyType=wholesale&search=tomato&pageNumber=1
```

**Query Parameters:**
- `category` - Filter by category name
- `district` - Filter by district
- `supplyType` - Filter by supply type (wholesale/small_scale)
- `search` - Search in product name
- `pageNumber` - Page number (default: 1)

### 2. Get Product By ID
```
GET http://localhost:4000/api/products/PRODUCT_ID_HERE
```
**No body required**

### 3. Get Products By Seller
```
GET http://localhost:4000/api/products/seller/SELLER_ID_HERE
```
**No body required**

### 4. Get All Categories
```
GET http://localhost:4000/api/categories
```
**No body required**

### 5. Get Category By ID
```
GET http://localhost:4000/api/categories/CATEGORY_ID_HERE
```
**No body required**

---

## 🔄 ANY AUTHENTICATED USER

### 1. Get Order By ID
```
GET http://localhost:4000/api/orders/ORDER_ID_HERE
Headers: Authorization: Bearer YOUR_TOKEN
```
**No body required**

### 2. Get Negotiation By ID
```
GET http://localhost:4000/api/negotiations/NEGOTIATION_ID_HERE
Headers: Authorization: Bearer YOUR_TOKEN
```
**No body required**

### 3. Update Order Status
```
PUT http://localhost:4000/api/orders/ORDER_ID_HERE/status
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "status": "processing"
}
```

**Order Status Values:**
- `pending` - Order created, awaiting payment
- `paid` - Payment confirmed
- `processing` - Order being prepared
- `delivered` - Order delivered
- `cancelled` - Order cancelled

---

## 📋 TESTING WORKFLOW

### Step 1: Health Check
```
GET http://localhost:4000/api/health
```

### Step 2: Login as Admin
```
POST http://localhost:4000/api/auth/login
Body: {"email": "admin@agrilink.lk", "password": "admin123"}
```
**Save the token from response!**

### Step 3: Get Categories
```
GET http://localhost:4000/api/categories
```

### Step 4: Get All Products
```
GET http://localhost:4000/api/products
```

### Step 5: Login as Seller
```
POST http://localhost:4000/api/auth/login
Body: {"email": "seller@agrilink.lk", "password": "seller123"}
```

### Step 6: Create Product (as Seller)
```
POST http://localhost:4000/api/products
Headers: Authorization: Bearer SELLER_TOKEN
Body: {Product JSON from above}
```

### Step 7: Login as Buyer
```
POST http://localhost:4000/api/auth/login
Body: {"email": "buyer@agrilink.lk", "password": "buyer123"}
```

### Step 8: Create Negotiation (as Buyer)
```
POST http://localhost:4000/api/negotiations
Headers: Authorization: Bearer BUYER_TOKEN
Body: {Negotiation JSON from above}
```

### Step 9: Get Seller Negotiations (as Seller)
```
GET http://localhost:4000/api/negotiations/seller
Headers: Authorization: Bearer SELLER_TOKEN
```

### Step 10: Counter Offer (as Seller)
```
PUT http://localhost:4000/api/negotiations/NEGOTIATION_ID
Headers: Authorization: Bearer SELLER_TOKEN
Body: {Counter offer JSON from above}
```

---

## 🔑 Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agrilink.lk | admin123 |
| Buyer | buyer@agrilink.lk | buyer123 |
| Seller | seller@agrilink.lk | seller123 |
| Agent | agent@agrilink.lk | agent123 |

---

## ⚠️ Important Notes

1. **Always include the Authorization header** for protected endpoints
2. **Save the token** from login response for subsequent requests
3. **Replace placeholder IDs** (PRODUCT_ID_HERE, USER_ID_HERE, etc.) with actual IDs from your database
4. **Content-Type must be application/json** for all POST/PUT requests
5. **Order status flow**: pending → paid → processing → delivered
6. **Negotiation status flow**: open → countered → agreed (or rejected)
7. All **dates are in ISO 8601 format**
8. All **IDs are MongoDB ObjectIDs** (24 character hex strings)

---

## 🐛 Common Errors

### 401 Unauthorized
- Token is missing or invalid
- Token has expired
- User doesn't have permission

### 403 Forbidden
- User role doesn't have access to this endpoint
- Example: Buyer trying to access seller-only endpoint

### 404 Not Found
- Resource with given ID doesn't exist
- Endpoint URL is incorrect

### 400 Bad Request
- Missing required fields
- Invalid data format
- Validation errors

---

## 📊 Sample Complete Flow

1. **Login as Seller** → Get token
2. **Create Product** → Get product ID
3. **Login as Buyer** → Get token
4. **View Products** → Find the product
5. **Create Negotiation** → Get negotiation ID
6. **Login as Seller** → Get token
7. **View Negotiations** → See buyer's request
8. **Counter Offer** → Update negotiation
9. **Login as Buyer** → Get token
10. **Accept Counter** → Finalize negotiation
11. **Create Order** → Place order with agreed price
12. **Upload Receipt** → Mark as paid
13. **Login as Admin** → Get token
14. **View All Orders** → Monitor platform activity
