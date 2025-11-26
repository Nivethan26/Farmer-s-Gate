const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: String,
    pricePerKg: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    image: String,
    stockQty: {
      type: Number,
      required: true,
      default: 0,
    },
    supplyType: {
      type: String,
      enum: ['small_scale', 'wholesale'],
      default: 'small_scale',
    },
    locationDistrict: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresOn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
