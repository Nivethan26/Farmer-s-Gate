import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('seller'), createProduct);

router.get('/myproducts', protect, authorize('seller'), getMyProducts);
router.get('/seller/:sellerId', getProductsBySeller);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, authorize('seller'), updateProduct)
  .delete(protect, authorize('seller'), deleteProduct);

export default router;