import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.patch('/items', cartController.updateCartItem);
router.delete('/items/:sku', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
