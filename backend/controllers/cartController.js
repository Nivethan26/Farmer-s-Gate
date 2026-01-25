import Cart from '../models/Cart.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, productName, pricePerKg, qty, image, sellerId, sellerName } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    
    // Check if item already exists
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({
        productId,
        productName,
        pricePerKg,
        qty,
        image,
        sellerId,
        sellerName
      });
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.productId.toString() === productId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    if (qty <= 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      item.qty = qty;
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    } else {
      cart.items = [];
      cart.redeemedPoints = 0;
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Update redeemed points
export const updateRedeemedPoints = async (req, res) => {
  try {
    console.log('updateRedeemedPoints called with:', req.body);
    console.log('User ID:', req.user?._id);
    
    const { redeemedPoints } = req.body;
    
    if (typeof redeemedPoints !== 'number' || redeemedPoints < 0) {
      console.error('Invalid redeemedPoints value:', redeemedPoints);
      return res.status(400).json({ error: 'Invalid redeemed points value' });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      console.log('Creating new cart for user:', req.user._id);
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    
    console.log('Before update - cart redeemedPoints:', cart.redeemedPoints);
    cart.redeemedPoints = redeemedPoints;
    
    await cart.save();
    console.log('After save - cart redeemedPoints:', cart.redeemedPoints);
    
    res.json(cart);
  } catch (error) {
    console.error('Update redeemed points error:', error);
    res.status(500).json({ error: 'Failed to update redeemed points', details: error.message });
  }
};