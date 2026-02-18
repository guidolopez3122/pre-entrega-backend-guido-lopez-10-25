import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { createCart, getCart, addProductToCart, deleteProductFromCart, updateCartProducts, updateProductQuantity, clearCart, purchaseCartController } from '../../controllers/cartController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCart);
router.post('/:cid/product/:pid', authenticate, authorize(['user']), addProductToCart);
router.delete('/:cid/product/:pid', authenticate, authorize(['user']), deleteProductFromCart);
router.put('/:cid', authenticate, authorize(['user']), updateCartProducts);
router.put('/:cid/product/:pid', authenticate, authorize(['user']), updateProductQuantity);
router.delete('/:cid', authenticate, authorize(['user']), clearCart);
router.post('/:cid/purchase', authenticate, authorize(['user']), purchaseCartController);

export default router;










