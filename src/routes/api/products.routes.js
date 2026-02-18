import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', authenticate, authorize(['admin']), createProduct);
router.put('/:pid', authenticate, authorize(['admin']), updateProduct);
router.delete('/:pid', authenticate, authorize(['admin']), deleteProduct);

export default router;







