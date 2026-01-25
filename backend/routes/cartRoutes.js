import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateRedeemedPoints
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Cart routes
router.get('/', getCart);                           // GET /api/cart
router.post('/add', addToCart);                     // POST /api/cart/add
router.put('/redeem-points', updateRedeemedPoints); // PUT /api/cart/redeem-points (specific route first)
router.put('/:productId', updateCartItem);          // PUT /api/cart/:productId (generic route last)
router.delete('/:productId', removeFromCart);       // DELETE /api/cart/:productId
router.delete('/', clearCart);                      // DELETE /api/cart

export default router;