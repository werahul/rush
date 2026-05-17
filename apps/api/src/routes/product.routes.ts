import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { productQuerySchema, createProductSchema } from '../validators/product.validator';

const router = Router();

router.get('/featured', productController.getFeaturedProducts);
router.get('/', validate(productQuerySchema, 'query'), productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createProductSchema),
  productController.createProduct
);
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

export default router;
