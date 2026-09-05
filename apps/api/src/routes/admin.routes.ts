import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as uploadController from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id', adminController.updateOrderStatus);
router.get('/users', adminController.getAllUsers);

router.post('/upload/image', upload.single('image'), uploadController.uploadImage);
router.post('/upload/images', upload.array('images', 6), uploadController.uploadImages);

export default router;
