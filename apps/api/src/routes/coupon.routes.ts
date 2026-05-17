import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/validate', authenticate, couponController.validateCoupon);
router.get('/', authenticate, authorize('admin'), couponController.getCoupons);
router.post('/', authenticate, authorize('admin'), couponController.createCoupon);

export default router;
