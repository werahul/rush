import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id', adminController.updateOrderStatus);
router.get('/users', adminController.getAllUsers);

export default router;
