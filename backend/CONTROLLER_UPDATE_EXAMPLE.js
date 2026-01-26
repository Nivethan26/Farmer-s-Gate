/**
 * EXAMPLE: How to update authController.js to use publicId
 * 
 * This file shows the changes needed in your controllers.
 * Apply similar patterns to other controllers (product, order, etc.)
 */

// ============================================================================
// STEP 1: Import the createWithPublicId helper at the top of the file
// ============================================================================

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { createWithPublicId } from '../utils/createWithPublicId.js';  // ← ADD THIS
// ... other imports


// ============================================================================
// STEP 2: Update the register function to use createWithPublicId
// ============================================================================

const register = asyncHandler(async (req, res) => {
  const { role, name, email, password, phone, firstName, lastName, ...otherFields } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validation (keep existing validation logic)
  if (role === 'buyer') {
    if (!firstName || !lastName) {
      res.status(400);
      throw new Error('First name and last name are required for buyers');
    }
  } else {
    if (!name) {
      res.status(400);
      throw new Error('Name is required for this role');
    }
  }

  // Create user data
  const userData = {
    role,
    email,
    password,
    phone,
    ...otherFields
  };

  // Add name for non-buyers or firstName/lastName for buyers
  if (role === 'buyer') {
    userData.firstName = firstName;
    userData.lastName = lastName;
  } else {
    userData.name = name;
  }

  // ========================================================================
  // CHANGE THIS SECTION:
  // ========================================================================
  
  // OLD CODE (REPLACE THIS):
  // const user = await User.create(userData);
  
  // NEW CODE (USE THIS):
  // Determine type character based on role
  const typeChar = role === 'seller' ? 'S' 
                 : role === 'buyer' ? 'B' 
                 : role === 'agent' ? 'A' 
                 : 'M'; // admin
  
  // Determine name for slug
  const nameForSlug = role === 'buyer' 
    ? `${firstName} ${lastName}`.trim() 
    : name || email.split('@')[0];
  
  // Create user with publicId
  const user = await createWithPublicId(
    User,
    userData,
    typeChar,
    nameForSlug
  );
  // ========================================================================

  if (user) {
    // Send welcome email
    const displayName = role === 'buyer' ? `${firstName} ${lastName}` : name;
    await sendWelcomeEmail(user.email, displayName);

    res.status(201).json({
      _id: user._id,
      publicId: user.publicId,  // ← ADD THIS to response
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      district: user.district,
      address: user.address,
      firstName: user.firstName,
      lastName: user.lastName,
      nic: user.nic,
      preferredCategories: user.preferredCategories,
      farmName: user.farmName,
      bank: user.bank,
      regions: user.regions,
      officeContact: user.officeContact,
      permissions: user.permissions,
      rewardPoints: user.rewardPoints,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ============================================================================
// STEP 3: Update login response to include publicId
// ============================================================================

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      publicId: user.publicId,  // ← ADD THIS
      role: user.role,
      name: user.name,
      // ... rest of fields
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// ============================================================================
// EXAMPLE: Product Controller Update
// ============================================================================

/**
 * Update productController.js similarly:
 */

// Import at top:
// import { createWithPublicId } from '../utils/createWithPublicId.js';

// In createProduct function:
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, pricePerKg, /* ... other fields */ } = req.body;
  
  // Validation...
  
  const productData = {
    name,
    category,
    pricePerKg,
    // ... other fields
  };
  
  // OLD: const product = await Product.create(productData);
  // NEW:
  const product = await createWithPublicId(
    Product,
    productData,
    'P',
    name
  );
  
  res.status(201).json({
    _id: product._id,
    publicId: product.publicId,  // ← Include in response
    name: product.name,
    // ... rest
  });
});


// ============================================================================
// EXAMPLE: Order Controller Update
// ============================================================================

/**
 * Update orderController.js:
 */

// Import at top:
// import { createWithPublicId } from '../utils/createWithPublicId.js';

// In createOrder function:
const createOrder = asyncHandler(async (req, res) => {
  const { buyerId, items, subtotal, /* ... */ } = req.body;
  
  const orderData = {
    buyerId,
    items,
    subtotal,
    // ... other fields
  };
  
  // OLD: const order = await Order.create(orderData);
  // NEW: Orders use date in slug automatically
  const order = await createWithPublicId(
    Order,
    orderData,
    'O',
    '' // Empty string - will use current date
  );
  
  res.status(201).json({
    _id: order._id,
    publicId: order.publicId,  // ← Include in response
    buyerId: order.buyerId,
    // ... rest
  });
});


// ============================================================================
// QUICK REFERENCE: Type Characters for Each Model
// ============================================================================

/**
 * User models (based on role):
 * - Seller → 'S'
 * - Buyer → 'B'
 * - Agent → 'A'
 * - Admin → 'M'
 * 
 * Other models:
 * - Order → 'O'
 * - Product → 'P'
 * - Category → 'C'
 * - Negotiation → 'N'
 * - SellerApprovalRequest → 'R'
 * 
 * Name for slug suggestions:
 * - User: user.name or user.firstName + lastName or email.split('@')[0]
 * - Product: product.name
 * - Order: '' (empty - uses date automatically)
 * - Category: category.name or category.slug
 * - Negotiation: productName or buyerName
 */

// ============================================================================
// TESTING YOUR CHANGES
// ============================================================================

/**
 * After updating controllers:
 * 
 * 1. Test user registration:
 *    POST /api/auth/register
 *    Check response includes publicId like "FGS-rahul-kumar-k4t9p"
 * 
 * 2. Test login:
 *    POST /api/auth/login
 *    Verify publicId is in response for existing users (after migration)
 * 
 * 3. Test product creation:
 *    POST /api/products
 *    Check publicId like "FGP-fresh-tomatoes-x5b8w"
 * 
 * 4. Test order creation:
 *    POST /api/orders
 *    Check publicId like "FGO-2026-01-26-9q3rv"
 * 
 * 5. Check database:
 *    mongo> db.users.findOne({}, { publicId: 1, name: 1 })
 *    Should show: { publicId: "FGS-...", name: "..." }
 */
