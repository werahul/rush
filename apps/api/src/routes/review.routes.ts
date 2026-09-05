import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
