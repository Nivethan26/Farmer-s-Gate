# Public ID Implementation Guide

## Overview
This system replaces long MongoDB ObjectIds with human-readable, meaningful public IDs across all models.

## Format
Pattern: `FG<Type>-<slug>-<suffix>`

### Type Codes
- **FGS**: Seller (e.g., `FGS-rahul-kumar-k4t9p`)
- **FGB**: Buyer (e.g., `FGB-jane-doe-x1b7z`)
- **FGA**: Agent (e.g., `FGA-john-smith-9q3rv`)
- **FGM**: Admin (e.g., `FGM-admin-7g2kq`)
- **FGO**: Order (e.g., `FGO-2026-01-26-4kz9p`)
- **FGP**: Product (e.g., `FGP-fresh-tomatoes-x5b8w`)
- **FGC**: Category (e.g., `FGC-vegetables-r2t9m`)
- **FGN**: Negotiation (e.g., `FGN-tomatoes-john-k1x7v`)
- **FGR**: Seller Approval Request (e.g., `FGR-farm-request-p9k3x`)

## Files Created

### Backend Utilities
1. **`backend/utils/publicId.js`**
   - Main generator function: `makePublicId(typeChar, name, prefix)`
   - Generates readable IDs with slugified names + random suffix

2. **`backend/utils/createWithPublicId.js`**
   - Safe creation helper: `createWithPublicId(Model, payload, typeChar, nameForSlug)`
   - Automatic retry on collision
   - Fallback ID generation if collisions persist

### Model Updates
Updated schemas with `publicId` field (unique, indexed, sparse):
- ✅ User.js
- ✅ Order.js
- ✅ Product.js
- ✅ Category.js
- ✅ Negotiation.js
- ✅ SellerApprovalRequest.js

### Migration Script
**`backend/scripts/backfillPublicIds.js`**
- Adds publicId to existing documents
- Processes in batches with error handling
- Provides detailed migration summary

### Frontend Updates
- ✅ Type definitions updated (admin.ts, authSlice.ts)
- ✅ SellersTab updated to display and search by publicId
- Search now works with: MongoDB _id, publicId, or name

## Installation

Dependencies already installed:
```bash
cd backend
npm install slugify nanoid  # ✅ Already installed
```

## Usage

### 1. Creating New Documents
Replace direct model creation with the safe helper:

**Before:**
```javascript
const newUser = new User(userData);
await newUser.save();
```

**After:**
```javascript
import { createWithPublicId } from '../utils/createWithPublicId.js';

const newUser = await createWithPublicId(
  User,
  userData,
  'B',  // Type: Buyer
  userData.name || userData.email
);
```

### 2. Example Controller Updates

**User Registration (authController.js):**
```javascript
import { createWithPublicId } from '../utils/createWithPublicId.js';

// Determine type based on role
const typeChar = role === 'seller' ? 'S' : role === 'buyer' ? 'B' : role === 'agent' ? 'A' : 'M';

const user = await createWithPublicId(
  User,
  { email, password, role, ...otherFields },
  typeChar,
  name || email.split('@')[0]
);
```

**Product Creation (productController.js):**
```javascript
import { createWithPublicId } from '../utils/createWithPublicId.js';

const product = await createWithPublicId(
  Product,
  productData,
  'P',
  productData.name
);
```

**Order Creation (orderController.js):**
```javascript
import { createWithPublicId } from '../utils/createWithPublicId.js';

const order = await createWithPublicId(
  Order,
  orderData,
  'O',
  '' // Orders use date in slug automatically
);
```

### 3. Running Migration
After deploying the schema changes, run once:

```bash
cd backend
node scripts/backfillPublicIds.js
```

**Expected Output:**
```
🚀 Starting publicId backfill migration...

🔗 Connecting to MongoDB...
✅ Connected to MongoDB

📋 Processing Users...
  ✓ User 507f1f77bcf86cd799439011 → FGS-rahul-k4t9p
  ✓ User 507f1f77bcf86cd799439012 → FGB-jane-doe-x1b7z
  ...

📦 Processing Orders...
📊 MIGRATION SUMMARY
...
🎉 Migration complete!
```

## API Changes

### Response Format
All APIs should now return `publicId` along with `_id`:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "publicId": "FGS-rahul-kumar-k4t9p",
  "name": "Rahul Kumar",
  "role": "seller"
}
```

### Frontend Display
The frontend automatically shows `publicId` when available, falling back to `_id`:

```tsx
// SellersTab.tsx (already updated)
<TableCell>{seller.publicId || seller._id}</TableCell>
```

## Key Features

### ✅ Collision Handling
- Automatic retry up to 5 times
- Fallback to timestamp-based ID if needed
- Logs all collisions for monitoring

### ✅ Backwards Compatibility
- `publicId` field is optional (sparse index)
- Existing code using `_id` continues to work
- Migration can run on live database

### ✅ Search Functionality
SellersTab already supports searching by:
- MongoDB `_id`
- `publicId` (e.g., "FGS-rahul")
- User name

## Next Steps

### Required Controller Updates
Update these controllers to use `createWithPublicId`:

1. **authController.js** - User registration/signup
2. **productController.js** - Product creation
3. **orderController.js** - Order placement
4. **categoryController.js** - Category creation (if applicable)
5. **negotiationController.js** - Negotiation creation
6. **sellerApprovalController.js** - Approval request creation

### Optional Enhancements
- Update more frontend components (BuyersTab, ProductsTab, OrdersTab, etc.)
- Add `publicId` to URL routes (e.g., `/seller/FGS-rahul-k4t9p`)
- Create lookup endpoints by `publicId`
- Add `publicId` to CSV exports

## Important Notes

1. **Keep `_id` for internal use** - Use `publicId` for external display/URLs only
2. **Immutable** - Once assigned, `publicId` should never change
3. **Unique Index** - Enforced at database level
4. **Sparse Index** - Allows documents without `publicId` during migration
5. **No PII** - Don't include email, phone, or sensitive data in slugs

## Testing Checklist

- [ ] Run migration script on staging database
- [ ] Verify publicIds generated correctly
- [ ] Check for any duplicate key errors
- [ ] Test user registration with publicId
- [ ] Test product creation with publicId
- [ ] Test order creation with publicId
- [ ] Verify frontend displays publicIds
- [ ] Test search functionality with publicId
- [ ] Check API responses include publicId

## Troubleshooting

**Duplicate Key Error:**
- Check if migration was run multiple times
- Verify sparse index is set correctly
- Look for collision logs in migration output

**publicId not showing in frontend:**
- Ensure API responses include `publicId` field
- Check TypeScript types are updated
- Verify frontend types match backend response

**Migration taking too long:**
- Reduce batch size in migration script
- Run during low-traffic periods
- Consider processing by model type separately

## Support

For questions or issues with the publicId implementation, check:
1. Migration logs for detailed error messages
2. Database indexes: `db.users.getIndexes()`
3. Sample documents: `db.users.findOne({ publicId: { $exists: true }})`
