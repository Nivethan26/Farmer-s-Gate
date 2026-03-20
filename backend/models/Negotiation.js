import mongoose from 'mongoose';

const negotiationSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  buyerId: {
    type: String,
    required: true
  },
  buyerName: {
    type: String,
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
  currentPrice: {
    type: Number,
    required: true
  },
  requestedPrice: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'countered', 'agreed', 'rejected'],
    default: 'open'
  },
  counterPrice: Number,
  counterNotes: String,
  agreedPrice: Number,
  // Agent-related fields
  agentConnected: {
    type: Boolean,
    default: false
  },
  agentNotes: {
    type: String,
    default: ''
  },
  escalatedToAdmin: {
    type: Boolean,
    default: false
  },
  escalationReason: String,
  escalatedAt: Date,
  escalatedBy: String,
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
negotiationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Negotiation = mongoose.model('Negotiation', negotiationSchema);

export default Negotiation;