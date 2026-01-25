import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  image: String,
  sellerId: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  totalWeight: {
    type: Number,
    default: 0
  },
  redeemedPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to calculate totals
cartSchema.methods.calculateTotals = function() {
  const totalWeight = this.items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = this.items.reduce((sum, item) => sum + item.pricePerKg * item.qty, 0);
  
  // Weight-based delivery fee calculation
  let deliveryFee = 0;
  if (totalWeight > 0) {
    if (totalWeight <= 1) deliveryFee = 180;
    else if (totalWeight <= 2) deliveryFee = 300;
    else deliveryFee = 300 + (totalWeight - 2) * 120;
  }
  
  // Apply redeemed points as discount (1 point = Rs. 1)
  const pointsDiscount = Math.min(this.redeemedPoints, subtotal + deliveryFee);
  const total = Math.max(0, subtotal + deliveryFee - pointsDiscount);
  
  this.subtotal = subtotal;
  this.deliveryFee = deliveryFee;
  this.total = total;
  this.totalWeight = totalWeight;
  
  return { subtotal, deliveryFee, total, totalWeight };
};

// Auto-calculate totals before saving
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;