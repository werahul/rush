import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import wishlistRoutes from './wishlist.routes';
import couponRoutes from './coupon.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'RUSH API is running', timestamp: new Date().toISOString() });
});

export default router;
