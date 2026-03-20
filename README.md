# Farmer's Gate - Full Stack Application Setup

A complete agricultural marketplace connecting farmers with buyers, featuring real-time negotiations, order management, and a reward system.

## 🏗️ Architecture

- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **Frontend**: React, TypeScript, Redux Toolkit, Tailwind CSS
- **Communication**: RESTful API with Axios/Fetch
- **Real-time Features**: Ready for WebSocket integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB running on localhost:27017
- Git

### 1. Clone and Setup

```bash
git clone <your-repo>
cd Farmer-s-Gate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

**Backend will run at: http://localhost:4000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server  
npm run dev
```

**Frontend will run at: http://localhost:8080**

## 🔌 API Integration

### Backend API Endpoints

All endpoints are prefixed with `/api`

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

**Products**
- `GET /products` - Get all products (with filters)
- `POST /products` - Create product (Seller)
- `PUT /products/:id` - Update product (Seller)
- `DELETE /products/:id` - Delete product (Seller)

**Orders** 
- `POST /orders` - Create order (Buyer)
- `GET /orders/myorders` - Get buyer orders
- `GET /orders/seller` - Get seller orders
- `PUT /orders/:id/status` - Update order status

**Negotiations**
- `POST /negotiations` - Create negotiation (Buyer)
- `GET /negotiations/buyer` - Get buyer negotiations
- `GET /negotiations/seller` - Get seller negotiations
- `PUT /negotiations/:id` - Update negotiation (Seller)

### Frontend API Services

The frontend uses a service layer for API communication:

```typescript
// Example usage in components
import { authAPI } from '@/services/authService';
import { productAPI } from '@/services/productService';

// Login example
const handleLogin = async () => {
  try {
    const user = await authAPI.login({ email, password });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### API Integration Features

- **Automatic Token Management**: JWT tokens are automatically stored and sent
- **Error Handling**: Centralized error handling with user-friendly messages
- **Loading States**: Built-in loading states for all async operations
- **Type Safety**: Full TypeScript interfaces for all API requests/responses

## 🔐 Authentication Flow

1. **Login**: User enters credentials → Frontend sends to `/auth/login` → Backend validates → Returns user data + JWT token
2. **Token Storage**: JWT token stored in localStorage and automatically included in subsequent requests
3. **Route Protection**: Frontend routes are protected based on user roles
4. **Auto-logout**: Token validation and automatic logout on expiry

## 🎭 User Roles & Permissions

### Buyer
- Browse and search products
- Create and manage orders
- Negotiate prices with sellers
- Earn and redeem reward points
- View order history

### Seller  
- Create and manage product listings
- View and fulfill orders
- Handle price negotiations
- Update order statuses
- View sales analytics

### Admin
- Manage all users and products
- View system-wide analytics
- Manage categories
- Handle user account statuses
- Access admin dashboard

### Agent
- Coordinate between buyers and sellers in assigned regions
- View regional activity
- Assist with negotiations
- Support role with read access

## 📊 Data Flow

### Product Browsing
```
Frontend → GET /api/products → Backend → MongoDB → JSON Response → Frontend State Update
```

### Order Creation
```
Frontend Cart → POST /api/orders → Validate Stock → Reduce Inventory → Create Order → Update State
```

### Price Negotiation
```
Buyer Request → POST /api/negotiations → Seller Response → PUT /api/negotiations → Status Update
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salting
- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Route-level permissions
- **Input Validation**: Mongoose schema validation
- **CORS Protection**: Configurable origins
- **SQL Injection Prevention**: Mongoose ODM protection

## 🔧 Development

### Environment Variables

**Backend (.env)**
```bash
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/farmers-gate
JWT_SECRET=your-super-secure-secret-key
CORS_ORIGIN=http://localhost:8080
```

**Frontend (Vite Proxy)**
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:4000',
    changeOrigin: true,
    secure: false,
  },
}
```

### Testing

**Test Backend API**
```bash
# Health check
curl http://localhost:4000/api/health

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrilink.lk","password":"admin123"}'
```

**Frontend Testing**
- Open http://localhost:8080
- Use demo credentials provided on login page
- Test user flows for each role

## 📝 Demo Credentials

| Role | Email | Password | Features |
|------|-------|----------|----------|
| Admin | admin@agrilink.lk | admin123 | Full system access |
| Buyer | buyer@agrilink.lk | buyer123 | Shopping, orders, negotiations |
| Seller | seller@agrilink.lk | seller123 | Product management, order fulfillment |
| Agent | agent@agrilink.lk | agent123 | Regional coordination |

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set strong JWT secret
   - Configure email service for notifications

2. **Database**
   - Use MongoDB Atlas or managed MongoDB
   - Run `npm run seed` on first deployment
   - Set up database backup strategy

3. **Server**
   - Deploy to service like Heroku, DigitalOcean, or AWS
   - Configure reverse proxy (Nginx recommended)
   - Set up SSL certificates
   - Use PM2 for process management

### Frontend Deployment

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Static hosting: Vercel, Netlify, or AWS S3
   - Update API base URL for production
   - Configure routing for SPA

3. **Environment**
   - Set `VITE_API_BASE_URL` to production backend URL
   - Configure production error tracking

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Verify backend CORS_ORIGIN matches frontend URL
- Check both servers are running on correct ports

**Authentication Failures**
- Ensure MongoDB is running and accessible
- Check JWT secret is set correctly
- Verify user exists in database

**API Connection Issues**
- Confirm backend is running on port 4000
- Test endpoints directly with curl/Postman
- Check Vite proxy configuration

**Database Connection**
- Verify MongoDB is running: `mongosh`
- Check connection string in .env
- Ensure database name matches (`farmers-gate`)

### Debug Mode

Enable detailed logging:

```bash
# Backend
DEBUG=* npm run dev

# Frontend  
VITE_LOG_LEVEL=debug npm run dev
```

## 🤝 Contributing

1. **Code Structure**: Follow existing patterns
2. **API Design**: RESTful conventions
3. **Error Handling**: Consistent error responses
4. **Type Safety**: Full TypeScript coverage
5. **Testing**: Add tests for new features

## 📚 Documentation

- **API Documentation**: See `API-TESTING-GUIDE.md`
- **Frontend Components**: Check component JSDoc comments
- **Database Schema**: See model files in `backend/models/`
- **Deployment Guide**: Available in production setup section

## 📞 Support

For development questions or issues:
1. Check this documentation
2. Review error logs
3. Test with demo credentials
4. Verify both servers are running

---

**🌱 Happy Coding! Connect Farmers with Technology! 🌱**