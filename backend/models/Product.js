import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  supplyType: {
    type: String,
    enum: ['small_scale', 'wholesale'],
    required: true
  },
  locationDistrict: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  stockQty: {
    type: Number,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  negotiationEnabled: {
    type: Boolean,
    default: false
  },
  expiresOn: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;