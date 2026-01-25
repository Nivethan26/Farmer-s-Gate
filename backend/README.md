# Farmer's Gate Backend API

A comprehensive backend API for the Farmer's Gate platform, built with Express.js, MongoDB, and Node.js.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for Buyers, Sellers, Agents, and Admins
- **Product Management**: CRUD operations for agricultural products
- **Order Management**: Complete order lifecycle with status tracking
- **Negotiation System**: Price negotiation between buyers and sellers
- **Reward Points**: Loyalty system for buyers
- **Email Notifications**: Welcome emails and OTP-based password reset
- **File Upload Support**: Image upload for products (ready for integration)

## User Roles

1. **Admin**: Full platform management access
2. **Seller**: Can create/manage products, view orders, handle negotiations
3. **Buyer**: Can browse products, place orders, create negotiations
4. **Agent**: Regional coordinators (ready for future features)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Seller only)
- `PUT /api/products/:id` - Update product (Seller only)
- `DELETE /api/products/:id` - Delete product (Seller only)
- `GET /api/products/myproducts` - Get seller's products
- `GET /api/products/seller/:sellerId` - Get products by seller

### Orders
- `POST /api/orders` - Create order (Buyer only)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/myorders` - Get buyer's orders
- `GET /api/orders/seller` - Get seller's orders
- `GET /api/orders/stats` - Get order statistics (Admin only)

### Negotiations
- `POST /api/negotiations` - Create negotiation (Buyer only)
- `GET /api/negotiations` - Get all negotiations (Admin only)
- `GET /api/negotiations/:id` - Get negotiation by ID
- `PUT /api/negotiations/:id` - Update negotiation (Seller only)
- `PUT /api/negotiations/:id/accept-counter` - Accept counter offer (Buyer only)
- `GET /api/negotiations/buyer` - Get buyer's negotiations
- `GET /api/negotiations/seller` - Get seller's negotiations
- `GET /api/negotiations/stats` - Get negotiation statistics (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)
- `PUT /api/users/:id/add-points` - Add reward points (Admin only)
- `PUT /api/users/:id/redeem-points` - Redeem reward points

### Health Check
- `GET /api/health` - API status check

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/farmers-gate
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

Optional (for email features):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password-or-app-password
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database:

```bash
npm run seed
```

This will create sample users, products, orders, and categories.

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

### 5. Test the API

Check if the API is running:
```bash
curl http://localhost:4000/api/health
```

## Default Test Accounts

After seeding, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agrilink.lk | admin123 |
| Buyer | buyer@agrilink.lk | buyer123 |
| Seller | seller@agrilink.lk | seller123 |
| Agent | agent@agrilink.lk | agent123 |

## Data Models

### User
```javascript
{
  role: 'buyer' | 'seller' | 'agent' | 'admin',
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  status: 'active' | 'pending' | 'inactive',
  
  // Role-specific fields
  firstName: String, // Buyer
  lastName: String,  // Buyer
  nic: String,       // Buyer
  district: String,
  address: String,
  preferredCategories: [String], // Buyer
  farmName: String,  // Seller
  bank: {            // Seller
    accountName: String,
    accountNo: String,
    bankName: String,
    branch: String
  },
  regions: [String], // Agent
  officeContact: String, // Agent
  permissions: [String], // Admin
  rewardPoints: Number   // Buyer rewards
}
```

### Product
```javascript
{
  name: String,
  category: String,
  pricePerKg: Number,
  supplyType: 'wholesale' | 'small_scale',
  locationDistrict: String,
  image: String,
  stockQty: Number,
  sellerId: String,
  sellerName: String,
  description: String,
  negotiationEnabled: Boolean,
  expiresOn: Date
}
```

### Order
```javascript
{
  buyerId: String,
  buyerName: String,
  buyerEmail: String,
  address: String,
  items: [{
    productId: String,
    productName: String,
    sellerId: String,
    sellerName: String,
    qty: Number,
    pricePerKg: Number
  }],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  redeemedPoints: Number,
  pointsEarned: Number,
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled',
  receiptUrl: String,
  paidAt: Date,
  deliveredAt: Date
}
```

### Negotiation
```javascript
{
  productId: String,
  productName: String,
  buyerId: String,
  buyerName: String,
  sellerId: String,
  sellerName: String,
  currentPrice: Number,
  requestedPrice: Number,
  notes: String,
  status: 'open' | 'countered' | 'agreed' | 'rejected',
  counterPrice: Number,
  counterNotes: String,
  agreedPrice: Number
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run seed:destroy` - Clear all data from database

## Error Handling

The API uses consistent error response format:

```javascript
{
  message: "Error description",
  stack: "Stack trace (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Route-level permission checking
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Request Size Limits**: 10MB limit for JSON payloads
- **Input Validation**: Mongoose schema validation

## Development Notes

### Database Connection
- Uses Mongoose ODM for MongoDB
- Automatic reconnection on disconnect
- Graceful error handling

### File Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Route handlers
├── middlewares/     # Custom middleware
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── services/       # External services (email)
├── utils/          # Utility functions
├── seed.js         # Database seeding
└── server.js       # Main application file
```

### Adding New Features
1. Create/update models in `models/`
2. Add controller functions in `controllers/`
3. Define routes in `routes/`
4. Add middleware if needed in `middlewares/`
5. Update seed data if necessary

## Production Deployment

1. Set `NODE_ENV=production`
2. Use proper MongoDB URI (Atlas recommended)
3. Set strong JWT secret
4. Configure email service for notifications
5. Set up proper logging
6. Configure reverse proxy (Nginx recommended)
7. Use PM2 for process management

## API Testing

See `../API-TESTING-GUIDE.md` for comprehensive testing instructions with example requests for all endpoints.

## Contributing

1. Follow existing code structure and patterns
2. Add proper error handling
3. Include input validation
4. Write clear commit messages
5. Test thoroughly before submitting

## License

ISC License - see package.json for details.