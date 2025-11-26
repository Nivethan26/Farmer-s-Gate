# Farmers Gate Backend

Complete backend API for the Farmers Gate agricultural e-commerce platform.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas connection string)
- npm or yarn

### Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/farmers-gate
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. For MongoDB Atlas, replace MONGODB_URI with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmers-gate
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires token)

### Users Routes (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `GET /role/sellers` - Get all sellers
- `GET /role/buyers` - Get all buyers
- `PUT /:id` - Update user profile (authenticated)
- `PATCH /:id/status` - Update user status (admin only)
- `DELETE /:id` - Delete user (admin only)

### Products Routes (`/api/products`)
- `GET /` - Get all products (with filters: category, district, supplyType, search)
- `GET /:id` - Get product by ID
- `GET /seller/:sellerId` - Get products by seller
- `POST /` - Create product (seller only)
- `PUT /:id` - Update product (seller only)
- `DELETE /:id` - Delete product (seller only)

### Orders Routes (`/api/orders`)
- `GET /` - Get all orders (admin only)
- `GET /buyer/my-orders` - Get current buyer's orders
- `GET /:id` - Get order by ID
- `POST /` - Create order (buyer only)
- `PATCH /:id/status` - Update order status (admin only)
- `PATCH /:id/pay` - Mark order as paid (buyer only)
- `DELETE /:id` - Delete order

### Categories Routes (`/api/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

### Negotiations Routes (`/api/negotiations`)
- `GET /` - Get negotiations for current user
- `GET /:id` - Get negotiation by ID
- `POST /` - Create negotiation
- `PATCH /:id/accept` - Accept negotiation (seller only)
- `PATCH /:id/reject` - Reject negotiation (seller only)
- `DELETE /:id` - Delete negotiation

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Sample Login Credentials (for testing)

Buyer:
- Email: buyer@agrilink.lk
- Password: buyer123

Seller:
- Email: seller@agrilink.lk
- Password: seller123

Admin:
- Email: admin@agrilink.lk
- Password: admin123

Agent:
- Email: agent@agrilink.lk
- Password: agent123

## Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Category.js
│   └── Negotiation.js
├── routes/              # API routes
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── categories.js
│   └── negotiations.js
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── roleAuth.js      # Role-based authorization
├── server.js            # Express server configuration
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md           # This file
```

## Database Models

### User
- id, name, email, password, phone, role, status
- Role-specific fields (district, address, farmName, bank, regions, etc.)

### Category
- id, name, slug, icon, description

### Product
- id, name, category, description, pricePerKg, image, stockQty
- supplyType, locationDistrict, sellerId, expiresOn

### Order
- id, buyerId, items[], subtotal, deliveryFee, total
- status, receiptUrl, paidAt, deliveredAt

### Negotiation
- id, productId, buyerId, sellerId, proposedPrice, quantity
- status, message, expiresAt

## Development Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days by default
- Role-based access control is enforced on protected routes
- CORS is enabled for frontend communication

## Next Steps

1. Start MongoDB
2. Install dependencies: `npm install`
3. Run the server: `npm run dev`
4. Use the API endpoints from your frontend
5. Update `.env` with your production credentials
